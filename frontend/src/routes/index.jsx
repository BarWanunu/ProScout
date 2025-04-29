// Export all route components from a single file
import AuthRoutes from './authRoutes';
import DashboardRoutes from './dashboardRoutes';

// Named exports
export { AuthRoutes, DashboardRoutes };

// You could also add combined routes or other routing utilities here
export const AllRoutes = () => (
  <>
    <AuthRoutes />
    <DashboardRoutes />
  </>
);