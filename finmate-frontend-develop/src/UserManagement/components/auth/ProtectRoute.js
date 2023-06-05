import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtectRoute = ({ component: Component, ...rest }) => {
  const isAuth = useSelector((state) => state.AuthReducer.isAuth);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth || localStorage.getItem("isAuth") === "true" ? (
          <Component {...props} />
        ) : (
          <Redirect to="/auth" />
        )
      }
    />
  );
};

export default ProtectRoute;