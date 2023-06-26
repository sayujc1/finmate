import moment from "moment";

export const AddFormValidate = async (reqObj, AddFormErrors) => {
  return new Promise((resolve, reject) => {
    let errorsCount = 0;
    if (!reqObj.description) {
      AddFormErrors.description = "Description Field cannot be empty";
      errorsCount++;
    } else {
      AddFormErrors.description = "";
    }
    if (reqObj.amount === 0) {
      AddFormErrors.amount = "Amount Field cannot be 0";
      errorsCount++;
    } else if (
      (reqObj.amount &&
        reqObj.amount.toString().match(/^\d*\.?\d*$/) === null) ||
      reqObj.amount <= 0
    ) {
      AddFormErrors.amount = "Amount is Invalid";
      errorsCount++;
    } else {
      AddFormErrors.amount = "";
    }
    if (!reqObj.date) {
      AddFormErrors.date = "Date Field cannot be empty";
      errorsCount++;
    } else if (reqObj.date && !moment(reqObj.date, "DD/MM/YYYY").isValid()) {
      AddFormErrors.date = "Date Field is Invalid";
      errorsCount++;
    } else {
      AddFormErrors.date = "";
    }
    if (!reqObj.category) {
      AddFormErrors.category = "Category Field cannot be empty";
      errorsCount++;
    } else if (
      reqObj.category === "Other" &&
      (!reqObj.category_others || reqObj.category_others?.trim() === "")
    ) {
      AddFormErrors.category_others = "Category Others Field cannot be empty";
      errorsCount++;
    } else {
      AddFormErrors.category_others = "";
      AddFormErrors.category = "";
    }
    if (errorsCount > 0) {
      reject(AddFormErrors);
    } else {
      resolve(AddFormErrors);
    }
  });
};
