import { SET_IS_AUTH, SET_AUTH_ERROR } from "../utils/Constants";

export const setIsAuth = (isAuth) => {
  return {
    type: SET_IS_AUTH,
    payload: isAuth,
  };
};

export const setAuthError = (error) => {
  return {
    type: SET_AUTH_ERROR,
    payload: error,
  };
};
