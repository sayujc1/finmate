import {
  SET_USER_DETAILS,
  RESET_USER_REDUCER,
} from "../utils/Constants";

export const setUserDetails = isAuth => {
  return {
    type: SET_USER_DETAILS,
    payload: isAuth,
  };
};

export const resetUserDetails = () => {
  return {
    type: RESET_USER_REDUCER,
  };
};
