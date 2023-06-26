import moment from "moment";

export const AddBillFormValidate = async (reqObj, AddFormErrors) => {
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
    if (!reqObj.due_date) {
      AddFormErrors.due_date = "Billing Date Field cannot be empty";
      errorsCount++;
    } else if (
      reqObj.due_date &&
      !moment(reqObj.due_date, "DD/MM/YYYY").isValid()
    ) {
      AddFormErrors.due_date = "Billing Date Field is Invalid";
      errorsCount++;
    } else {
      AddFormErrors.due_date = "";
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
    if (reqObj.is_recurring === 1) {
      if (!reqObj.recurring_type_value) {
        AddFormErrors.recurring_type_value = "Recurring Period cannot be empty";
        errorsCount++;
      } else if (
        reqObj.recurring_type === "month" &&
        (parseInt(reqObj.recurring_type_value) < 1 ||
          parseInt(reqObj.recurring_type_value) > 11)
      ) {
        AddFormErrors.recurring_type_value =
          "Recurring Period should be between 1 and 11";
        errorsCount++;
      } else if (
        reqObj.recurring_type === "days" &&
        parseInt(reqObj.recurring_type_value) < 1
      ) {
        AddFormErrors.recurring_type_value =
          "Recurring Period should be greater than 0";
        errorsCount++;
      } else if (
        reqObj.recurring_type === "year" &&
        (parseInt(reqObj.recurring_type_value) < 1 ||
          parseInt(reqObj.recurring_type_value) > 100)
      ) {
        AddFormErrors.recurring_type_value =
          "Recurring Period should be between 1 and 100";
        errorsCount++;
      } else {
        AddFormErrors.recurring_type_value = "";
      }
    } else {
      AddFormErrors.recurring_type_value = "";
    }
    if (errorsCount > 0) {
      reject(AddFormErrors);
    } else {
      resolve(AddFormErrors);
    }
  });
};
