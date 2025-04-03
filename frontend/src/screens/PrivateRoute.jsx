// PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, admin = false }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  if (admin && !userInfo.isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;