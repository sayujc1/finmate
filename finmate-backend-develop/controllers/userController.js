const { getDbConnection, closeDbConnection } = require('../config/dbconfig');
const util = require('util');
const {
  INTERNAL_SERVER_ERROR,
  // USER_UPDATED_SUCCESS,
  // USER_NOT_EXISTS,
} = require('../messages/responseMessages');
const {
  // checkIfUserExistsByUsernameOrEmail,
  fetchUserDetailsByUserId,
  fetchUserRolesByUserId,
  fetchUserProfileDetails,
  // updateUserDetails,
} = require('../repository/userRepository');

exports.viewUserDetails = async (req, res) => {
  try {
    let user = req.user;
    let connection = await getDbConnection();
    let connectionPromise = util.promisify(connection.query).bind(connection);
    fetchUserDetailsByUserId(connectionPromise, user)
        .then(async UserRows => {
              if (UserRows.length > 0) {
                res.status(200).json({ status: 'SUCCESS', data: UserRows });
              } else {
                res.status(200).json({ status: 'NOT FOUND', data: [] });
              }
        })
        .catch(err => {
          res.status(500).json({
            status: 'FAILURE',
            error: [{ msg: err.message || INTERNAL_SERVER_ERROR }],
          });
        });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: 'FAILURE',
      error: [{ msg: INTERNAL_SERVER_ERROR }],
    });
  }
};

// exports.updateUserDetails = async (req, res) => {
//   let connection;
//   try {
//     connection = await getDbConnection();
//     let currentmonth = new Date().getMonth() + 1;
//     let currentyear = new Date().getFullYear();
//     let user = req.body;
//     user = { ...user, user_id: req.user.user_id };
//     let connectionPromise = util.promisify(connection.query).bind(connection);

//     let updateuser = { ...user };

//     // check if email already exists for different user
//     checkIfUserExistsByUsernameOrEmail(connectionPromise, updateuser)
//       .then(async rows => {
//         if (rows.length > 0) {
//           res.status(409).json({
//             status: 'FAILURE',
//             error: [{ msg: 'Email already exists' }],
//           });
//         } else {
//           //check if teacher details exists for the user id, yes - update teacher details & user details , no - update user details
//           if (updateuser.t_id) {
//             let result = await fetchUserProfileDetails(
//               connectionPromise,
//               updateuser
//             );
//             // if user exists in the database, then update user
//             if (result.length > 0) {
//               // fetch designation id
//               result = await fetchDesignationByDesignation(
//                 connectionPromise,
//                 updateuser.designation
//               );
//               updateuser.d_id = result[0].d_id;
//               //fetch department id
//               result = await fetchDepartmentByDepartment(
//                 connectionPromise,
//                 updateuser.department
//               );
//               updateuser.dep_id = result[0].dep_id;
//               result = await updateTeacherDetails(
//                 connectionPromise,
//                 updateuser
//               );
//               result = await updateSalaryDetails(
//                 connectionPromise,
//                 updateuser,
//                 currentmonth,
//                 currentyear
//               );
//               result = await updateUserDetails(connectionPromise, updateuser);
//               res
//                 .status(200)
//                 .json({ status: 'SUCCESS', data: USER_UPDATED_SUCCESS });
//             } else {
//               res.status(400).json({
//                 status: 'FAILURE',
//                 error: [{ name: updateuser.name, msg: USER_NOT_EXISTS }],
//               });
//             }
//           } else {
//             result = await updateUserDetails(connectionPromise, updateuser);
//             res
//               .status(200)
//               .json({ status: 'SUCCESS', data: USER_UPDATED_SUCCESS });
//           }
//         }
//       })
//       .catch(err => {
//         res.status(500).json({
//           status: 'FAILURE',
//           error: [{ msg: err.message || INTERNAL_SERVER_ERROR }],
//         });
//       });
//     // }
//   } catch (error) {
//     res.status(error.statusCode || 500).json({
//       status: 'FAILURE',
//       error: [{ msg: INTERNAL_SERVER_ERROR }],
//     });
//   } finally {
//     await closeDbConnection(connection);
//   }
// };
