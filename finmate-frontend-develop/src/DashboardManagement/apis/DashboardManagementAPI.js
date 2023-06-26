import { api } from "../../api";
import {
  setDashboardDetails,
  setRecentTransactionsDetails,
} from "../actions/DashboardManagementAction";

export const getMonthDashboardDetails = (dateType, date, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post("/dashboard/viewDashboardDetails", {
        dateType: dateType,
        date: date,
      })
      .then(response => {
        let data = response.data?.data;
        dispatch(setDashboardDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const loadRecentTransactionsDetails = (limit, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get("/transaction/viewRecentTransactionDetails/" + limit)
      .then(response => {
        let data = response.data?.data;
        dispatch(setRecentTransactionsDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
