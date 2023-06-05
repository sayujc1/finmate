import { SET_SAVINGS_TRANSACTIONS } from "../utils/Constants";

const initialState = {
  savingTransactions: [],
  totalSaving: 0,
};
const SavingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVINGS_TRANSACTIONS:
      return {
        ...state,
        savingTransactions: action.payload.data,
        totalSaving: action.payload.totalIncome,
      };

    default:
      return state;
  }
};

export default SavingReducer;
