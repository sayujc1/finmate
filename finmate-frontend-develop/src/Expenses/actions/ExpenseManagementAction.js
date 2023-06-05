import {
  SET_EXPENSE_TRANSACTIONS,
} from "../utils/Constants";

export const setExpenseDetails = (data) => {
  return {
    type: SET_EXPENSE_TRANSACTIONS,
    payload: data,
  };
};
