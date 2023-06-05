import {
  SET_IS_AUTH,
  RESET_AUTH_REDUCER,
  SET_AUTH_ERROR,
} from "../utils/Constants";
const initialState = {
  isAuth: false,
  authError: null,
};
const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IS_AUTH: {
      return {
        ...state,
        isAuth: action.payload,
        authError: null,
      };
    }

    case SET_AUTH_ERROR: {
      localStorage.setItem("token", "none");
      return {
        ...state,
        authError: true,
        isAuth: false,
      };
    }
    case RESET_AUTH_REDUCER: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};

export default AuthReducer;
