import {
  SET_INCOME_TRANSACTIONS,
  RESET_INCOME_REDUCER,
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

export const setIncomeDetails = (data) => {
  return {
    type: SET_INCOME_TRANSACTIONS,
    payload: data,
  };
};
export const resetDashboardState = () => {
  return {
    type: RESET_INCOME_REDUCER,
  };
};
