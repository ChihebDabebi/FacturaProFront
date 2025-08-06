// third party
import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import { AuthProvider, useAuth } from './context/AuthContext';

// Loading wrapper to wait for auth initialization
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
