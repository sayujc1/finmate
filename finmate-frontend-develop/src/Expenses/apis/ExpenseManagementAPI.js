import { api } from "../../api";
import { setExpenseDetails } from "../actions/ExpenseManagementAction";

export const loadExpenseTransactionsDetails = (type, date, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get("/transaction/viewTransactionDetails/" + type + "/" + date)
      .then((response) => {
        let data = response.data.data;
        dispatch(setExpenseDetails(data));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const deleteExpenseTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .delete("/transaction/deleteTransactionDetails/" + record1.t_id)
      .then((response) => {
        let data = data1.expenseTransactions.filter((item) => item.t_id !== record1.t_id);
        let totalExpense = data1.totalExpense - record1.amount;
        dispatch(setExpenseDetails({data,totalIncome:totalExpense}));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
}