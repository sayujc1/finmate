import { SET_EDIT_DATA, RESET_EDIT_DATA } from "../utils/Constants";
const initialState = {
  isEdit: false,
  editData: {},
};
const CommonReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDIT_DATA:
      console.log("action.payload", action.payload)
      return {
        ...state,
        isEdit: true,
        editData: action.payload,
      };
    case RESET_EDIT_DATA:
        return {
            ...initialState,
        };
    default:
      return state;
  }
};

export default CommonReducer;
