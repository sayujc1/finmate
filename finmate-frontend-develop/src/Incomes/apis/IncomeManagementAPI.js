import { api } from "../../api";
import { setIncomeDetails } from "../actions/IncomeManagementAction";

export const loadIncomeTransactionsDetails = (type, date, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get("/transaction/viewTransactionDetails/" + type + "/" + date)
      .then(response => {
        let data = response.data.data;
        dispatch(setIncomeDetails(data));
        resolve(response.data);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const deleteIncomeTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .delete("/transaction/deleteTransactionDetails/" + record1.t_id)
      .then(response => {
        let data = data1.incomeTransactions.filter(
          item => item.t_id !== record1.t_id
        );
        let totalIncome = data1.totalIncome - record1.amount;
        dispatch(setIncomeDetails({ data, totalIncome }));
        resolve(response.data);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
