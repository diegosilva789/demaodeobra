import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isLogin = () => {
  if (localStorage.getItem('token')) {
    return true;
  }
  return false;
}

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={props => (
      isLogin() ?
        <Component {...props} />
        : <Redirect to="/Login" />
    )} />
  );
};

export default PrivateRoute;