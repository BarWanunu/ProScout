import React from 'react';
import { AllRoutes } from './routes';
import AppLayout from './components/layout/AppLayout';

function App() {
  return (
      <AppLayout>
        <AllRoutes />
      </AppLayout>
  );
}

export default App;