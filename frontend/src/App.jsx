import { AllRoutes } from './routes';
import AppLayout from './layout/overallLayout/AppLayout';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
      <AppLayout>
        <ScrollToTop />
        <AllRoutes />
      </AppLayout>
  );
}

export default App;