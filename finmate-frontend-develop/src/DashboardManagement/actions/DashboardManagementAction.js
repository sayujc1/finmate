import {
  SET_DASHBOARD_DETAILS,
  RESET_DASHBOARD_REDUCER,
  SET_RECENT_TRANSACTIONS,
} from "../utils/Constants";

export const setDashboardDetails = (data) => {
  return {
    type: SET_DASHBOARD_DETAILS,
    payload: data,
  };
};
export const setRecentTransactionsDetails = (data) => {
  return {
    type: SET_RECENT_TRANSACTIONS,
    payload: data,
  };
};

export const resetDashboardState = () => {
  return {
    type: RESET_DASHBOARD_REDUCER,
  };
};
