import {
  SET_SAVINGS_TRANSACTIONS,
} from "../utils/Constants";

export const setSavingsDetails = (data) => {
  return {
    type: SET_SAVINGS_TRANSACTIONS,
    payload: data,
  };
};
