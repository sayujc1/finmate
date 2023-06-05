import { api } from "../../api";
import { setIncomeDetails } from "../actions/IncomeManagementAction";

export const loadIncomeTransactionsDetails = (type, date, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get("/transaction/viewTransactionDetails/" + type + "/" + date)
      .then((response) => {
        let data = response.data.data;
        dispatch(setIncomeDetails(data));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const deleteIncomeTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .delete("/transaction/deleteTransactionDetails/" + record1.t_id)
      .then((response) => {
        let data = data1.incomeTransactions.filter((item) => item.t_id !== record1.t_id);
        let totalIncome = data1.totalIncome - record1.amount;
        dispatch(setIncomeDetails({data,totalIncome}));
        resolve(response.data);
      })
      .catch((error) => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
}


// export const UpdateForm = (reducer, editData, record1, formType, dispatch) => {
//   return new Promise(async (resolve, reject) => {
//       await api()
//           .put("/transaction/updateTransactionDetails", record1)
//           .then((response) => {
//               if(formType==="Income"){
//                   // let reducer = useSelector(state => state.IncomeReducer);
//                   let data = reducer.incomeTransactions.map((item) => {
//                       if(item.t_id === record1.t_id){
//                           return record1;
//                       }else{
//                           return item;
//                       }
//                   });
//                   let totalIncome = reducer.totalIncome - editData.amount + parseInt(record1.amount);
//                   dispatch(setIncomeDetails({data,totalIncome}));
//               }
              // else if(formType==="Expense"){
              //     let reducer = useSelector(state => state.ExpenseReducer);
              //     let data = reducer.expenseTransactions.map((item) => {
                  //     if(item.t_id === record1.t_id){
                  //         return record1;
                  //     }else{
                  //         return item;
                  //     }
                  // });
              //     let totalExpense = reducer.totalExpense - editData.amount + record1.amount;
              //     data.unshift(record1);
              //     dispatch(setExpenseDetails({data,totalExpense}));
              // }else{
              //     let reducer = useSelector(state => state.SavingsReducer);
              //     let data = reducer.savingsTransactions.map((item) => {
                  //     if(item.t_id === record1.t_id){
                  //         return record1;
                  //     }else{
                  //         return item;
                  //     }
                  // });
              //     let totalSavings = reducer.totalSavings - editData.amount + record1.amount;
              //     data.unshift(record1);
              //     dispatch(setSavingsDetails({data,totalSavings}));
              // }
//               resolve(true);
//           })
//           .catch((error) => {
//               reject(error?.response?.data?.error?.[0].msg);
//           });
//   });
// };