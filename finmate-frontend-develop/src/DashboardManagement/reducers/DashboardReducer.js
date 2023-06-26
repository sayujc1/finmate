import {
  SET_DASHBOARD_DETAILS,
  RESET_DASHBOARD_REDUCER,
  SET_RECENT_TRANSACTIONS,
} from "../utils/Constants";
const initialState = {
  monthMap: [
    "Month",
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUNE",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ],
  totalIncome: 0,
  totalExpense: 0,
  totalSavings: 0,
  totalBalance: 0,
  dashboardDetails: [],
  recentTransactions: [],
};
const DashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_DETAILS: {
      return {
        ...state,
        totalIncome: action.payload?.totalIncome,
        totalExpense: action.payload?.totalExpense,
        totalSavings: action.payload?.totalSavings,
        totalBalance: action.payload?.totalBalance,
        dashboardDetails: action.payload
          ? action.payload.data?.length > 0 && action.payload.data
          : [],
      };
    }
    case SET_RECENT_TRANSACTIONS: {
      return {
        ...state,
        recentTransactions: action.payload,
      };
    }
    case RESET_DASHBOARD_REDUCER: {
      return {
        ...initialState,
      };
    }
    default:
      return state;
  }
};

export default DashboardReducer;
