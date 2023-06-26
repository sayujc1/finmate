export const AddBudgetFormValidate = async (reqObj, AddFormErrors) => {
  return new Promise((resolve, reject) => {
    let errorsCount = 0;
    if (reqObj.budget === 0) {
      AddFormErrors.budget = "Budget Field cannot be 0";
      errorsCount++;
    } else if (
      (reqObj.budget &&
        reqObj.budget.toString().match(/^\d*\.?\d*$/) === null) ||
      reqObj.budget <= 0
    ) {
      AddFormErrors.budget = "Budget is Invalid";
      errorsCount++;
    } else {
      AddFormErrors.budget = "";
    }
    if (errorsCount > 0) {
      reject(AddFormErrors);
    } else {
      resolve(AddFormErrors);
    }
  });
};
