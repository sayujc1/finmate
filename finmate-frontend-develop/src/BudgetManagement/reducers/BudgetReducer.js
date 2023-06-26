import {
  SET_BUDGET_TRANSACTIONS,
  RESET_BUDGET_REDUCER,
  SET_EDIT_DATA,
  RESET_EDIT_DATA,
} from "../utils/Constants";
const initialState = {
  budgetTransactions: [],
  totalBudget: 0,
  totalSpent: 0,
  status: "N/A",
  isEdit: false,
  editData: {},
};
const BudgetReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BUDGET_TRANSACTIONS:
      return {
        ...state,
        budgetTransactions: action.payload.data,
        totalBudget: action.payload.totalBudget,
        totalSpent: action.payload.totalSpent,
        status: action.payload.status,
      };
    case RESET_BUDGET_REDUCER: {
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

export default BudgetReducer;
