import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import fs from 'fs';

// 存储 KVStore 实例的缓存
const storeCache = new Map<string, KVStore>();

export class KVStore {
  private db: Database | null = null;
  private dbPath: string;
  private scope: string;

  private constructor(scope: string) {
    this.scope = scope;
    // 获取用户数据目录
    const userDataPath = app.getPath('userData');
    const kvStorePath = path.join(userDataPath, 'kv-store');
    
    // 确保目录存在
    if (!fs.existsSync(kvStorePath)) {
      fs.mkdirSync(kvStorePath, { recursive: true });
    }

    // 为每个 scope 创建独立的数据库文件
    this.dbPath = path.join(kvStorePath, `${scope}.db`);
  }

  async init() {
    if (this.db) return;

    this.db = await open({
      filename: this.dbPath,
      driver: sqlite3.Database
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS kv_store (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `);
  }

  async set(key: string, value: any) {
    if (!this.db) await this.init();
    
    const jsonValue = JSON.stringify(value);
    await this.db!.run(
      'INSERT OR REPLACE INTO kv_store (key, value) VALUES (?, ?)',
      [key, jsonValue]
    );
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    const row = await this.db!.get(
      'SELECT value FROM kv_store WHERE key = ?',
      [key]
    );

    if (!row) return null;
    return JSON.parse(row.value);
  }

  async delete(key: string) {
    if (!this.db) await this.init();

    await this.db!.run(
      'DELETE FROM kv_store WHERE key = ?',
      [key]
    );
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.db) await this.init();

    const rows = await this.db!.all(
      'SELECT key FROM kv_store'
    );

    return rows.map(row => row.key);
  }

  async clear() {
    if (!this.db) await this.init();

    await this.db!.run('DELETE FROM kv_store');
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  // 工厂方法，用于创建或获取 KVStore 实例
  static async create(scope: string): Promise<KVStore> {
    const store = new KVStore(scope);
    await store.init();
    return store;
  }
}

// 获取 KVStore 实例的全局函数
export async function getKVStore(scope: string): Promise<KVStore> {
  if (!storeCache.has(scope)) {
    const store = await KVStore.create(scope);
    storeCache.set(scope, store);
  }
  return storeCache.get(scope)!;
}

// 清理缓存的函数（可选，用于需要清理资源时）
export async function clearKVStores() {
  for (const store of storeCache.values()) {
    await store.close();
  }
  storeCache.clear();
}
