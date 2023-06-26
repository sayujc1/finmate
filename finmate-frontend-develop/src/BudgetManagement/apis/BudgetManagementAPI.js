import { api } from "../../api";
import { setBudgetDetails } from "../actions/BudgetManagementAction";
export const getBudgetDetails = (dateType, dateStart, dateEnd, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post("/budget/viewBudgetDetails", {
        dateType: dateType,
        start_date: dateStart,
        end_date: dateEnd,
      })
      .then(response => {
        let data = response.data?.data;
        dispatch(setBudgetDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const deleteBudgetTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .delete("/budget/deleteBudgetDetails/" + record1.b_id)
      .then(response => {
        let data = data1.budgetTransactions.filter(
          item => item.b_id !== record1.b_id
        );
        let totalBudget =
          parseFloat(data1.totalBudget) - parseFloat(record1.budget);
        let totalSpent =
          parseFloat(data1.totalSpent) - parseFloat(record1.spent);
        let status = totalSpent >= totalBudget ? "Over Limit" : "Under Limit";
        dispatch(setBudgetDetails({ data, totalBudget, totalSpent, status }));
        resolve(response.data);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const AddBudgetFormDetails = (reducer, budget, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post("/budget/addBudgetDetails", budget)
      .then(response => {
        budget.b_id = response.data.data?.b_id;
        budget.spent = response.data.data?.spent;
        budget.status = response.data.data?.status;
        let totalBudget =
          parseFloat(reducer.totalBudget) + parseFloat(budget.budget);
        let totalSpent = reducer.totalSpent + parseFloat(budget.spent);
        let status = totalSpent >= totalBudget ? "Over Limit" : "Under Limit";
        let data = [budget, ...reducer.budgetTransactions];
        dispatch(setBudgetDetails({ data, totalBudget, totalSpent, status }));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const UpdateForm = (reducer, editData, record, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .put("/budget/updateBudgetDetails", record)
      .then(response => {
        record.spent = response.data.data?.spent;
        record.status = response.data.data?.status;
        let totalBudget =
          parseFloat(reducer.totalBudget) -
          parseFloat(editData.budget) +
          parseFloat(record.budget);
        let totalSpent =
          parseFloat(reducer.totalSpent) -
          parseFloat(editData.spent) +
          parseFloat(record.spent);
        let status = totalSpent >= totalBudget ? "Over Limit" : "Under Limit";
        let data = reducer.budgetTransactions.map(item => {
          if (item.b_id === record.b_id) {
            return record;
          } else {
            return item;
          }
        });
        dispatch(
          setBudgetDetails({ data: data, totalBudget, totalSpent, status })
        );
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
