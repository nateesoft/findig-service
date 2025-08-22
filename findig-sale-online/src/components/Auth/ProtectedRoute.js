import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, user, isInitialized }) => {
  // แสดง loading จนกว่า app จะ initialize เสร็จ
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>กำลังโหลด...</div>
        </div>
      </div>
    );
  }

  // หลังจาก initialize แล้ว ถ้าไม่มี user ให้ redirect ไป login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;