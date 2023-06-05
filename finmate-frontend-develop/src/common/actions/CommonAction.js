import {
  SET_EDIT_DATA,
  RESET_EDIT_DATA,
} from "../utils/Constants";

export const setEditDetails = (data) => {
  return {
    type: SET_EDIT_DATA,
    payload: data,
  };
};
export const resetEditState = () => {
  return {
    type: RESET_EDIT_DATA,
  };
};
