import {
  SET_TRANSACTION_DETAILS,
  RESET_TRANSACTION_REDUCER,
  SET_EDIT_DATA,
  RESET_EDIT_DATA,
} from "../utils/Constants";

export const setTransactionDetails = (data) => {
  return {
    type: SET_TRANSACTION_DETAILS,
    payload: data,
  };
};

export const resetTransactionState = () => {
  return {
    type: RESET_TRANSACTION_REDUCER,
  };
};


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
