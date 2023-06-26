import { api } from "../../api";
import { setBillDetails } from "../actions/BillManagementAction";

export const getTransactionDetailsByBillId = (bill_id, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get("/transaction/viewTransactionsDetailsByBillId/" + bill_id)
      .then(response => {
        resolve(response.data?.data);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
export const getBillDetails = (selected, dispatch) => {
  return new Promise(async (resolve, reject) => {
    let url = "/bill/viewActiveBillDetails";
    if (selected === "InActive Bills") {
      url = "/bill/viewInActiveBillDetails";
    }
    await api()
      .get(url)
      .then(response => {
        let data = response.data?.data;
        dispatch(setBillDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const cancelBillTransaction = (data1, record1, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .put("/bill/cancelBillDetails/" + record1.bill_id)
      .then(response => {
        let data = data1.billTransactions.filter(
          item => item.bill_id !== record1.bill_id
        );
        dispatch(setBillDetails(data));
        resolve(response.data);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const AddBillFormDetails = (reducer, bill, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post("/bill/addBillDetails", bill)
      .then(response => {
        bill.bill_id = response.data.data?.bill_id;
        let data = [bill, ...reducer.billTransactions];
        dispatch(setBillDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const UpdateForm = (reducer, record, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .put("/bill/updateBillDetails", record)
      .then(response => {
        let data = reducer.billTransactions.map(item => {
          if (item.bill_id === record.bill_id) {
            return record;
          } else {
            return item;
          }
        });
        dispatch(setBillDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const UpdateBillStatus = (reducer, record, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .put("/bill/updateBillStatus", record)
      .then(response => {
        let data =
          response.data?.data.status === "Paid"
            ? reducer.billTransactions.map(item => {
                if (item.bill_id === record.bill_id) {
                  return response.data?.data;
                } else {
                  return item;
                }
              })
            : reducer.billTransactions.filter(
                item => item.bill_id !== record.bill_id
              );
        dispatch(setBillDetails(data));
        resolve(true);
      })
      .catch(error => {
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
