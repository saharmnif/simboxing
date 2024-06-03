import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import AuthService from '../Components/Authservice'; // Importez votre service d'authentification

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();

  return (
    <Route {...rest} render={(props) =>
      AuthService.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        () => {
          navigate('/');
          return null;
        }
      )
    } />
  );
};

export default PrivateRoute;
