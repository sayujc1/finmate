import { api } from "../../api";
import { setIsAuth, setAuthError } from "../actions/AuthManagementAction";
import { resetUserDetails } from "../actions/UserManagementAction";

export const login = (user, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post(`/auth/login`, { ...user })
      .then(response => {
        localStorage.setItem("token", response.data.token);
        dispatch(setIsAuth(true));
        resolve(response.data);
      })
      .catch(error => {
        dispatch(setAuthError(error?.response?.data?.error?.[0].msg));
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const register = (user, dispatch) => {
  return new Promise(async (resolve, reject) => {
    await api()
      .post(`/auth/register`, { ...user })
      .then(response => {
        localStorage.setItem("token", response.data.token);
        dispatch(setIsAuth(true));
        resolve(response.data);
      })
      .catch(error => {
        dispatch(setAuthError(error?.response?.data?.error?.[0].msg));
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

export const logout = dispatch => {
  return new Promise(async (resolve, reject) => {
    await api()
      .get(`/auth/logout`)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        dispatch(setIsAuth(false));
        dispatch(resetUserDetails());
        resolve(response.data);
      })
      .catch(error => {
        dispatch(setIsAuth(error));
        dispatch(setAuthError(error?.response?.data?.error?.[0].msg));
        dispatch(resetUserDetails());
        reject(error?.response?.data?.error?.[0].msg);
      });
  });
};

// export const updateUserPassword = (user, dispatch) => {
//   return new Promise(async (resolve, reject) => {
//     await api()
//       .post(`/auth/updatePassword`, { ...user })
//       .then(response => {
//         resolve(response.data);
//       })
//       .catch(error => {
//         dispatch(setAuthError(error?.response?.data?.error?.[0].msg));
//         reject(error?.response?.data?.error?.[0].msg);
//       });
//   });
// };
