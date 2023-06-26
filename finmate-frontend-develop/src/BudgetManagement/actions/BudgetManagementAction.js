import {
  SET_BUDGET_TRANSACTIONS,
  RESET_BUDGET_REDUCER,
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

export const setBudgetDetails = data => {
  return {
    type: SET_BUDGET_TRANSACTIONS,
    payload: data,
  };
};
export const resetBudgetState = () => {
  return {
    type: RESET_BUDGET_REDUCER,
  };
};
