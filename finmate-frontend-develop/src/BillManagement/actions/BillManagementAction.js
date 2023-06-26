import {
  SET_BILL_TRANSACTIONS,
  RESET_BILL_REDUCER,
  SET_EDIT_DATA,
  RESET_EDIT_DATA,
} from "../utils/Constants";

export const setEditDetails = data => {
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

export const setBillDetails = data => {
  return {
    type: SET_BILL_TRANSACTIONS,
    payload: data,
  };
};
export const resetBillState = () => {
  return {
    type: RESET_BILL_REDUCER,
  };
};
