import {
  SET_USER_DETAILS,
  RESET_USER_REDUCER,

} from "../utils/Constants";

const initialState = {
  userDetails: {},


 
};
const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DETAILS: {
      return {
        ...state,
        userDetails: action.payload,
       
      };
    }
    case RESET_USER_REDUCER: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};

export default UserReducer;
