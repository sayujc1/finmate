import { api } from "../../api";
import { setTransactionDetails } from "../actions/TransactionManagementAction";

export const getTransactionDetails = (dateType, dateStart, dateEnd , dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post("/transaction/viewTransactionDetails",{
        dateType: dateType,
        dateStart: dateStart,
        dateEnd: dateEnd,
      })
      .then((response) => {
        console.log(response.data);
        let data = response.data?.data;
        dispatch(setTransactionDetails(data));
        resolve(true);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const deleteTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .delete("/transaction/deleteTransactionDetails/" + record1.t_id)
      .then((response) => {
        let data = data1.transactionDetails.filter((item) => item.t_id !== record1.t_id);
        let totalIncome = data1.totalIncome;
        let totalExpense = data1.totalIncome;
        let totalSavings = data1.totalSavings;
        let totalBalance = data1.totalBalance;
        if(record1.type === "Income"){
           totalIncome = data1.totalIncome - record1.amount;
           totalBalance = data1.totalBalance - record1.amount;
        }else if(record1.type === "Expense"){
           totalBalance = data1.totalBalance + record1.amount;
           totalExpense = data1.totalExpense - record1.amount;
        }else{
           totalBalance = data1.totalBalance + record1.amount;
           totalSavings = data1.totalSavings - record1.amount;
        }
        dispatch(setTransactionDetails({data,totalIncome,totalExpense,totalSavings,totalBalance}));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
}

export const UpdateForm = (reducer, editData, record1, formType, dispatch) => {
  return new Promise(async (resolve, reject) => {
      await api()
          .put("/transaction/updateTransactionDetails", record1)
          .then(() => {
            let totalIncome = reducer.totalIncome;
            let totalExpense = parseInt(reducer.totalExpense);
            let totalSavings = reducer.totalSavings;
            let totalBalance = reducer.totalBalance;
              if(record1.type==="Income"){
                  // let reducer = useSelector(state => state.IncomeReducer);
                  totalIncome = parseInt(reducer.totalIncome) - parseInt(editData.amount) + parseInt(record1.amount)
                  // totalIncome = reducer.totalIncome + parseInt(record1.amount);
                  totalBalance = parseInt(reducer.totalBalance) - parseInt(editData.amount) + parseInt(record1.amount);
                 
              }
              else if(record1.type==="Expense"){
                totalBalance = parseInt(reducer.totalBalance) + parseInt(editData.amount) - parseInt(record1.amount);
                totalExpense = parseInt(reducer.totalExpense) - parseInt(editData.amount) + parseInt(record1.amount);
             }else{
                totalBalance = parseInt(reducer.totalBalance) + parseInt(editData.amount) - parseInt(record1.amount);
                totalSavings = parseInt(reducer.totalSavings) - parseInt(editData.amount) + parseInt(record1.amount);
             }
              let data = reducer.transactionDetails.map((item) => {
                if(item.t_id === record1.t_id){
                    return record1;
                }else{
                    return item;
                }
            });
            dispatch(setTransactionDetails({data,totalIncome,totalExpense,totalSavings,totalBalance}));
              resolve(true);
          })
          .catch((error) => {
              reject(error?.response?.data?.error?.[0].msg);
          });
  });
};