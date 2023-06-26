import { api } from "../../api";
import { setSavingsDetails } from "../actions/SavingManagementAction";

export const loadSavingTransactionsDetails = (type, date, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get("/transaction/viewTransactionDetails/" + type + "/" + date)
      .then((response) => {
        let data = response.data.data;
        dispatch(setSavingsDetails(data));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const deleteSavingTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .delete("/transaction/deleteTransactionDetails/" + record1.t_id)
      .then((response) => {
        let data = data1.savingTransactions.filter((item) => item.t_id !== record1.t_id);
        let totalSaving = data1.totalSaving - record1.amount;
        dispatch(setSavingsDetails({data,totalIncome:totalSaving}));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
}