exports.fetchTransactionDetailsByType = async (connectionPromise, type, month, year, user) => {
    let result = await connectionPromise(`SELECT * FROM transactions WHERE type = '${type}' AND MONTH(date) = '${month}' AND YEAR(date) = '${year}' and user_id = '${user.user_id}'`);
    return result;
}

exports.deleteTransactionDetailsById = async (connectionPromise, tid, user) => {
    let result = await connectionPromise(`DELETE FROM transactions WHERE t_id = '${tid}' AND user_id = '${user.user_id}'`);
    return result;
}

exports.addTransactionDetails = async (connectionPromise, transaction, user) => {
    let result = await connectionPromise(`INSERT INTO transactions (user_id, type, amount, date, description, category, remarks, category_others) VALUES ('${user.user_id}', '${transaction.type}', '${transaction.amount}', '${transaction.date}', '${transaction.description}', '${transaction.category}', '${transaction.remarks}', '${transaction.category_others}')`);
    return result;
}

exports.updateTransactionDetails = async (connectionPromise, transaction, user) => {
    let result = await connectionPromise(`UPDATE transactions SET type = '${transaction.type}', amount = '${transaction.amount}', date = '${transaction.date}', description = '${transaction.description}', category = '${transaction.category}', remarks = '${transaction.remarks}', category_others = '${transaction.category_others}' WHERE t_id = '${transaction.t_id}' AND user_id = '${user.user_id}'`);
    return result;
}

exports.fetchTransactionDetails = async (connectionPromise, dateType, dateStart, dateEnd, user) => {
    let query = `SELECT * FROM transactions WHERE user_id = '${user.user_id}'`;
    if(dateType === "date"){
        query += ` AND date = '${dateStart.split("/").reverse().join("/")}'`;
    } else if (dateType === "week") {
        //WEEKE 23rd remove rd from week
        // dateStart = dateStart.replace(/(\d)(st|nd|rd|th)/, "$1");
        query += ` AND WEEK(date) = '${dateStart.split("-")[1]}' AND YEAR(date) = '${dateStart.split("-")[0]}'`;
    } else if (dateType === "month") {
        query += ` AND MONTH(date) = '${dateStart.split("-")[1]}' AND YEAR(date) = '${dateStart.split("-")[0]}'`;
    } else if (dateType === "year") {
        query += ` AND YEAR(date) = '${dateStart}'`;
    } else if(dateType === "quarter"){
         //Quarter Q3 remove Q from quarter
        dateStart = dateStart.replace(/Q/, "");
        
        query += ` AND QUARTER(date) = '${dateStart.split("-")[1]}' AND YEAR(date) = '${dateStart.split("-")[0]}'`;
    }
    else{
        query += ` AND date BETWEEN '${dateStart.split("/").reverse().join("/")}' AND '${dateEnd.split("/").reverse().join("/")}'`;
    }
    let result = await connectionPromise(query);
    return result;
}

exports.fetchRecentTransactionDetails = async (connectionPromise, limit, user) => {
    let result = await connectionPromise(`SELECT * FROM transactions WHERE user_id = '${user.user_id}' ORDER BY last_updated_time DESC LIMIT ${limit}`);
    return result;
}