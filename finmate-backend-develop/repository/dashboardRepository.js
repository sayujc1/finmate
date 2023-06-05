exports.fetchDashboardDetails = async (connectionPromise, dateType, date, user) => {
    let query = `SELECT * FROM transactions WHERE user_id = '${user.user_id}'`;
    if (dateType === "month") {
        query += ` AND MONTH(date) = '${date.split("-")[1]}' AND YEAR(date) = '${date.split("-")[0]}'`;
    } else if (dateType === "year") {
        query += ` AND YEAR(date) = '${date}'`;
    } else if(dateType === "quarter"){
         //Quarter Q3 remove Q from quarter
        date = date.replace(/Q/, "");
        
        query += ` AND QUARTER(date) = '${date.split("-")[1]}' AND YEAR(date) = '${date.split("-")[0]}'`;
    }
    let result = await connectionPromise(query);
    return result;
}