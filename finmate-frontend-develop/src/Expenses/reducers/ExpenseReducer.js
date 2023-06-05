import { SET_EXPENSE_TRANSACTIONS } from "../utils/Constants";

const initialState = {
  expenseTransactions: [],
  totalExpense: 0,
};
const ExpenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXPENSE_TRANSACTIONS:
      return {
        ...state,
        expenseTransactions: action.payload.data,
        totalExpense: action.payload.totalIncome,
      };

    default:
      return state;
  }
};

export default ExpenseReducer;
