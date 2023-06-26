import { SET_INCOME_TRANSACTIONS } from "../utils/Constants";
const initialState = {
  incomeTransactions: [],
  totalIncome: 0,
};
const IncomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INCOME_TRANSACTIONS:
      return {
        ...state,
        incomeTransactions: action.payload.data,
        totalIncome: action.payload.totalIncome,
      };

    default:
      return state;
  }
};

export default IncomeReducer;
