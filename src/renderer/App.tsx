import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Chat Bot
        </Typography>
      </Box>
    </Container>
  );
};

export default App; 