import {
  SET_BILL_TRANSACTIONS,
  RESET_BILL_REDUCER,
  SET_EDIT_DATA,
  RESET_EDIT_DATA,
} from "../utils/Constants";

const initialState = {
  billTransactions: [],
  isEdit: false,
  editData: {},
};
const BillReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BILL_TRANSACTIONS:
      return {
        ...state,
        billTransactions: action.payload,
      };
    case RESET_BILL_REDUCER: {
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

export default BillReducer;
