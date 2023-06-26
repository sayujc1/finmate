import { api } from "../../api";
import { setUserDetails } from "../actions/UserManagementAction";
import { setAuthError } from "../actions/AuthManagementAction";

export const getUserDetails = dispatch => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get(`/user/viewUserDetails`)
      .then(response => {
        dispatch(setUserDetails(response.data.data[0]));
        resolve(response.data);
      })
      .catch(error => {
        dispatch(setAuthError(error?.response?.data?.error?.[0].msg));
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};
