import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, requiredRole, ...rest }) => {
  const isLoggedIn = !!localStorage.getItem('username');
  const userRole = localStorage.getItem('role');

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn) {
          if (!requiredRole || requiredRole === userRole) {
            // User has the correct role, allow access
            return <Component {...props} />;
          } else {
            // User has a different role, redirect to their designated page
            if (userRole === '0') {
              return <Redirect to="/home" />;
            } else if (userRole === '1') {
              return <Redirect to="/admin/news" />;
            } else if (userRole === '2') {
              return <Redirect to="/faculty/attendance" />;
            } else {
              return <Redirect to="/default" />;
            }
          }
        } else {
          // User is not logged in, redirect to the login page
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
