import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user }) => {
  console.log('ProtectedRoute:', user)
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;