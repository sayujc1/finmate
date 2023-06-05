export const profileValidation = async (editUserDetails, profileErrors) => {
  return new Promise((resolve, reject) => {
    let errorsCount = 0;
    if (editUserDetails.t_id) {
      if (!editUserDetails.name) {
        profileErrors.name = "Name is required";
        errorsCount++;
      } else if (editUserDetails.name.match(/^[a-zA-Z ]+$/) === null) {
        profileErrors.name = "Name is invalid";
        errorsCount++;
      } else {
        profileErrors.name = "";
      }

      if (!editUserDetails.aadhaar_no) {
        profileErrors.aadhaar_no = "Aadhaar No. is required";
        errorsCount++;
      } else if (
        editUserDetails.aadhaar_no.length !== 12 ||
        editUserDetails.aadhaar_no.match(
          /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/
        ) === null
      ) {
        profileErrors.aadhaar_no = "Aadhaar No. is Invalid";
        errorsCount++;
      } else {
        profileErrors.aadhaar_no = "";
      }
      if (!editUserDetails.pan_no) {
        profileErrors.pan_no = "PAN No. is required";
        errorsCount++;
      } else if (
        editUserDetails.pan_no.length !== 10 ||
        editUserDetails.pan_no.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/) === null
      ) {
        profileErrors.pan_no = "PAN No. is Invalid";
        errorsCount++;
      } else {
        profileErrors.pan_no = "";
      }

      if (
        editUserDetails.email &&
        !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
          editUserDetails.email
        )
      ) {
        profileErrors.email = "Email is Invalid";
        errorsCount++;
      } else {
        profileErrors.email = "";
      }
      if (editUserDetails.phone && editUserDetails.phone.length !== 10) {
        profileErrors.phone = "Phone No. is Invalid";
        errorsCount++;
      } else {
        profileErrors.phone = "";
      }
      if (editUserDetails.address && editUserDetails.address.length > 75) {
        profileErrors.address =
          "Length of address should be less than 76 characters";
        errorsCount++;
      } else {
        profileErrors.address = "";
      }
      if (errorsCount > 0) {
        reject(profileErrors);
      } else {
        resolve(profileErrors);
      }
    } else {
      if (!editUserDetails.name) {
        profileErrors.name = "Name is required";
        errorsCount++;
      } else if (editUserDetails.name.match(/^[a-zA-Z ]+$/) === null) {
        profileErrors.name = "Name is invalid";
        errorsCount++;
      } else {
        profileErrors.name = "";
      }
      if (
        editUserDetails.email &&
        !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
          editUserDetails.email
        )
      ) {
        profileErrors.email = "Email is Invalid";
        errorsCount++;
      } else {
        profileErrors.email = "";
      }
      if (errorsCount > 0) {
        reject(profileErrors);
      } else {
        resolve(profileErrors);
      }
    }
  });
};
