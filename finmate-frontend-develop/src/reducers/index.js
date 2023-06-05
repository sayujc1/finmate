import { combineReducers } from "redux";
import DashboardReducer from "../DashboardManagement/reducers/DashboardReducer";
import AuthReducer from "../UserManagement/reducers/AuthReducer";
import UserReducer from "../UserManagement/reducers/UserReducer";
import IncomeReducer from "../Incomes/reducers/IncomeReducer";
import ExpenseReducer from "../Expenses/reducers/ExpenseReducer";
import SavingReducer from "../Savings/reducers/SavingReducer";
import CommonReducer from "../common/reducers/CommonReducer";
import TransactionReducer from "../Transactions/reducers/TransactionReducer";
export default combineReducers({
  DashboardReducer,
  AuthReducer,
  UserReducer,
  IncomeReducer,
  CommonReducer,
  ExpenseReducer,
  SavingReducer,
  TransactionReducer,
});
