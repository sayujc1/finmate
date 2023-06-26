import {
  SET_TRANSACTION_DETAILS,
  RESET_TRANSACTION_REDUCER,
  SET_EDIT_DATA,
  RESET_EDIT_DATA,
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
  transactionDetails: [],
  isEdit: false,
  editData: {},
};
const TransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTION_DETAILS: {
      return {
        ...state,
        totalIncome: action.payload?.totalIncome,
        totalExpense: action.payload?.totalExpense,
        totalSavings: action.payload?.totalSavings,
        totalBalance: action.payload?.totalBalance,
        transactionDetails: action.payload
          ? action.payload.data?.length > 0 && action.payload.data
          : [],
      };
    }
    case RESET_TRANSACTION_REDUCER: {
      return {
        ...initialState,
      };
    }
    case SET_EDIT_DATA:
      return {
        ...state,
        isEdit: true,
        editData: action.payload,
      };
    case RESET_EDIT_DATA:
      return {
        ...state,
        isEdit: false,
        editData: {},
      };
    default:
      return state;
  }
};

export default TransactionReducer;
