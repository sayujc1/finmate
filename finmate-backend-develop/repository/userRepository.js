exports.fetchUserDetails = async (connectionPromise, user) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      `SELECT * FROM user_details WHERE username= ? OR email= ? AND is_active=?`,
      [user, user, 1]
    )
      .then(async rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.fetchUserDetailsByUserId = async (connectionPromise, user) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      `SELECT user_id,username,email,name FROM user_details WHERE user_id=? AND is_active=?`,
      [user.user_id, 1]
    )
      .then(async rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
};
exports.fetchUserDetailsByUsernameOREmail = async (
  connectionPromise,
  username,
  email
) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      `SELECT user_id,username,email,name FROM user_details WHERE username= ? OR email= ?`,
      [username, email]
    )
      .then(async rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.checkIfUserExistsByUsernameOrEmail = async (
  connectionPromise,
  user
) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      `SELECT user_id,username,email,name FROM (SELECT user_id,username,email,name,is_active FROM user_details ud WHERE user_id != ? AND is_active = ?) u WHERE username= ? OR email= ? AND is_active=?`,
      [user.user_id, 1, user.username, user.email, 1]
    )
      .then(async rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.saveUser = async (connectionPromise, user) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      `INSERT INTO user_details (name, username, password, email, is_active) VALUES (?, ?, ?, ?, ?)`,
      [user.name, user.username, user.password, user.email, 1]
    )
      .then(async rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.updateUserDetails = async (connectionPromise, user) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      "UPDATE user_details SET email = ?, name=? WHERE user_id = ? AND is_active=?",
      [user.email, user.name, user.user_id, 1]
    )
      .then(async () => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.updateUserPassword = async (connectionPromise, user) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      "UPDATE user_details  SET password = ? WHERE username = ? AND email = ? AND is_active=?",
      [user.password, user.username, user.email, 1]
    )
      .then(async () => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
};

exports.deactivateUserByUserId = async (connectionPromise, user_id) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      "UPDATE user_details SET is_active = ? WHERE user_id = ?",
      [0, user_id]
    )
      .then(async () => {
        resolve(true);
      })
      .catch(err => {
        reject(err);
      });
  });
};
