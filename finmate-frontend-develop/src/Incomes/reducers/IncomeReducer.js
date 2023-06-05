import { SET_INCOME_TRANSACTIONS, SET_EDIT_DATA, RESET_EDIT_DATA } from "../utils/Constants";
const initialState = {
  incomeTransactions: [],
  totalIncome: 0,
  // isEdit: false,
  // editData: {},
};
const IncomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INCOME_TRANSACTIONS:
      console.log("action.payload", action.payload)
      return {
        ...state,
        incomeTransactions: action.payload.data,
        totalIncome: action.payload.totalIncome,
      };
      // case SET_EDIT_DATA:
      //   console.log("action.payload", action.payload)
      //   return {
      //     ...state,
      //     isEdit: true,
      //     editData: action.payload,
      //   };
      // case RESET_EDIT_DATA:
      //     return {
      //         ...state,
      //         isEdit: false,
      //         editData: {},
      //     };
    default:
      return state;
  }
};

export default IncomeReducer;
