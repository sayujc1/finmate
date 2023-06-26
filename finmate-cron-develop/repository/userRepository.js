exports.fetchUserDetails = async (connectionPromise, limit, offset) => {
  return new Promise(async (resolve, reject) => {
    connectionPromise(
      `SELECT * FROM user_details WHERE is_active=? LIMIT ? OFFSET ?`,
      [1, limit, offset]
    )
      .then(async rows => {
        resolve(rows);
      })
      .catch(err => {
        reject(err);
      });
  });
};
