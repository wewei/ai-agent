import React, { useState } from 'react';
import Layout from './components/Layout';
import SettingsDialog from './components/SettingsDialog';
import ChatPane from './components/ChatPane';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [topic, setTopic] = useState<string>('');

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  return (
    <Layout onOpenSettings={handleOpenSettings} title={topic}>
      <ChatPane setTopic={setTopic} />
      <SettingsDialog 
        open={isSettingsOpen}
        onClose={handleCloseSettings}
      />
    </Layout>
  );
};

export default App; 