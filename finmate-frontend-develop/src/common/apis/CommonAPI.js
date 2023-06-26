import { api } from "../../api";
import { setIncomeDetails } from "../../Incomes/actions/IncomeManagementAction";
import { setExpenseDetails } from "../../Expenses/actions/ExpenseManagementAction";

import { setSavingsDetails } from "../../Savings/actions/SavingManagementAction";

export const AddFormDetails = (reducer, record1, formType, dispatch) => {
  return new Promise(async (resolve, reject) => {
    record1.type = formType;
    await api()
      .post("/transaction/addTransactionDetails", record1)
      .then(response => {
        record1.t_id = response.data.data;
        if (formType === "Income") {
          let data = reducer.incomeTransactions;
          let totalIncome =
            parseInt(reducer.totalIncome) + parseInt(record1.amount);
          data = [record1, ...data];
          dispatch(setIncomeDetails({ data, totalIncome }));
        } else if (formType === "Expense") {
          let data = reducer.expenseTransactions;
          let totalExpense =
            parseInt(reducer.totalExpense) + parseInt(record1.amount);
          data = [record1, ...data];
          dispatch(setExpenseDetails({ data, totalIncome: totalExpense }));
        } else {
          let data = reducer.savingTransactions;
          let totalSaving =
            parseInt(reducer.totalSaving) + parseInt(record1.amount);
          data = [record1, ...data];
          dispatch(setSavingsDetails({ data, totalIncome: totalSaving }));
        }
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const UpdateForm = (reducer, editData, record1, formType, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .put("/transaction/updateTransactionDetails", record1)
      .then(() => {
        if (formType === "Income") {
          let data = reducer.incomeTransactions.map(item => {
            if (item.t_id === record1.t_id) {
              return record1;
            } else {
              return item;
            }
          });
          let totalIncome =
            reducer.totalIncome - editData.amount + parseInt(record1.amount);
          dispatch(setIncomeDetails({ data, totalIncome }));
        } else if (formType === "Expense") {
          let data = reducer.expenseTransactions.map(item => {
            if (item.t_id === record1.t_id) {
              return record1;
            } else {
              return item;
            }
          });
          let totalExpense =
            reducer.totalExpense - editData.amount + parseInt(record1.amount);

          dispatch(setExpenseDetails({ data, totalIncome: totalExpense }));
        } else {
          let data = reducer.savingTransactions.map(item => {
            if (item.t_id === record1.t_id) {
              return record1;
            } else {
              return item;
            }
          });

          let totalSaving =
            reducer.totalSaving - editData.amount + parseInt(record1.amount);

          dispatch(setSavingsDetails({ data, totalIncome: totalSaving }));
        }
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
