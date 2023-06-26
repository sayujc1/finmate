const { getDbConnection, closeDbConnection } = require("../config/dbconfig");
const util = require("util");
const { INTERNAL_SERVER_ERROR } = require("../messages/responseMessages");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  fetchUserDetails,
  fetchUserDetailsByUsernameOREmail,
  saveUser,
} = require("../repository/userRepository");
const { default: axios } = require("axios");

exports.register = async (req, res) => {
  let connection;
  try {
    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let hashPass = await bcrypt.hash(password, 10);
    connection = await getDbConnection();
    let connectionPromise = util.promisify(connection.query).bind(connection);
    // check if user already exists
    fetchUserDetailsByUsernameOREmail(connectionPromise, username, email).then(
      async rows => {
        if (rows.length > 0) {
          res.status(409).json({
            status: "FAILURE",
            error: [{ msg: "User already exists" }],
          });
        } else {
          let user = {
            name: name,
            username: username,
            password: hashPass,
            email: email,
          };

          // insert user_details
          saveUser(connectionPromise, user)
            .then(async rows => {
              if (rows.affectedRows > 0) {
                let user_id = rows.insertId;
                user = { ...user, user_id };
                let jwts = util.promisify(jwt.sign);
                let token = await jwts(
                  { username, email, name, user_id },
                  process.env.JWT_SECRET,
                  {
                    expiresIn: "24h",
                  }
                );
                res
                  .status(200)
                  .cookie("token", token, {
                    httpOnly: true,
                    maxAge: 86400000,
                    secure:
                      process.env.NODE_ENV === "production" ||
                      process.env.NODE_ENV === "development" ||
                      process.env.NODE_ENV === "preview"
                        ? true
                        : false,
                  })
                  .json({
                    status: "SUCCESS",
                    message: "User created successfully",
                    token: token,
                  });
              } else {
                res.status(400).json({
                  status: "FAILURE",
                  error: [{ msg: "User not created" }],
                });
              }
            })
            .catch(err => {
              res.status(500).json({
                status: "FAILURE",
                error: [{ msg: err.message || INTERNAL_SERVER_ERROR }],
              });
            });
        }
      }
    );
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "FAILURE",
      error: [{ msg: err.message || INTERNAL_SERVER_ERROR }],
    });
  } finally {
    await axios.post(
      `${process.env.CRON_ORIGIN}/cron/welcomeEmailService`,
      req.body
    );
    await closeDbConnection(connection);
  }
};

exports.login = async (req, res) => {
  let connection;
  try {
    let user = req.body.user;
    let password = req.body.password;
    connection = await getDbConnection();
    let connectionPromise = util.promisify(connection.query).bind(connection);
    // check if user exists
    fetchUserDetails(connectionPromise, user).then(async rows => {
      if (rows.length > 0) {
        isValidPass = password
          ? await bcrypt.compare(password, rows[0].password)
          : false;
        if (isValidPass) {
          let jwts = util.promisify(jwt.sign);
          let token = await jwts(
            {
              username: rows[0].username,
              email: rows[0].email,
              name: rows[0].name,
              user_id: rows[0].user_id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "24h",
            }
          );
          res
            .status(200)
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 86400000,
              secure:
                process.env.NODE_ENV === "production" ||
                process.env.NODE_ENV === "development" ||
                process.env.NODE_ENV === "preview"
                  ? true
                  : false,
            })
            .json({
              status: "SUCCESS",
              message: "User logged in successfully",
              token: token,
            });
        } else {
          res.status(400).json({
            status: "FAILURE",
            error: [{ msg: "Invalid password" }],
          });
        }
      } else {
        res.status(400).json({
          status: "FAILURE",
          error: [{ msg: "Invalid Username or Email ID" }],
        });
      }
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "FAILURE",
      error: [{ msg: err.message || INTERNAL_SERVER_ERROR }],
    });
  } finally {
    await closeDbConnection(connection);
  }
};

exports.logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", null, {
      httpOnly: true,
      maxAge: 1,
      secure:
        process.env.NODE_ENV === "production" ||
        process.env.NODE_ENV === "development" ||
        process.env.NODE_ENV === "preview"
          ? true
          : false,
    })
    .json({
      status: "SUCCESS",
      message: "User logged out successfully",
      token: null,
    });
};

// exports.updatePassword = async (req, res) => {
//   let connection;
//   try {
//     let user = req.body.username;
//     let oldPassword = req.body.old_password; // password from the user
//     let newPassword = req.body.new_password;
//     connection = await getDbConnection();
//     let connectionPromise = util.promisify(connection.query).bind(connection);

//     // check if user exists
//     fetchUserDetails(connectionPromise, user).then(async rows => {
//       if (rows.length > 0) {
//         isValidPass = oldPassword
//           ? await bcrypt.compare(oldPassword, rows[0].password)
//           : false;
//         if (isValidPass) {
//           let hashPass = await bcrypt.hash(newPassword, 10); // hashing the new password
//           // update the existing password with the new one

//           let updateuser = {
//             username: req.body.username,
//             password: hashPass,
//             email: req.body.email,
//           };
//           let result = await updateUserPassword(connectionPromise, updateuser);
//           res
//             .status(200)
//             .json({ status: 'SUCCESS', data: USER_PASSWORD_UPDATED_SUCCESS });
//         } else {
//           res.status(400).json({
//             status: 'FAILURE',
//             error: [{ msg: 'Invalid Password' }],
//           });
//         }
//       } else {
//         res.status(400).json({
//           status: 'FAILURE',
//           error: [{ msg: 'Invalid Username or Email ID' }],
//         });
//       }
//     });
//   } catch (err) {
//     res.status(err.statusCode || 500).json({
//       status: 'FAILURE',
//       error: [{ msg: err.message || INTERNAL_SERVER_ERROR }],
//     });
//   } finally {
//     await closeDbConnection(connection);
//   }
// };
