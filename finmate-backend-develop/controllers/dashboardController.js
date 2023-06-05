const { getDbConnection, closeDbConnection } = require("../config/dbconfig");
const util = require("util");
const {
    DASHBOARD_DETAILS_DOES_NOT_EXISTS,
} = require("../messages/responseMessages");
const {
    fetchDashboardDetails,
} = require("../repository/dashboardRepository");
const moment = require("moment");

exports.viewDashboardDetails = async (req, res) => {
  let connection = await getDbConnection();
  let connectionPromise = util.promisify(connection.query).bind(connection);
  let dateType = req.body.dateType;// month ,quarter ,year
  let date = req.body.date;
  try{
    let result = await fetchDashboardDetails(
        connectionPromise,
        dateType,
        date,
        req.user
    );
    if (result.length > 0) {
      result.map((item) => {
        item.date = moment(item.date).format("DD/MM/YYYY");
      });
        let income = result.filter(item=>item.type==="Income").reduce((a,b)=>a+b.amount,0);
        let expense = result.filter(item=>item.type==="Expense").reduce((a,b)=>a+b.amount,0);
        let savings = result.filter(item=>item.type==="Saving").reduce((a,b)=>a+b.amount,0);
        res.status(200).json({
        status: 'SUCCESS',
        data: {
            data:result, 
            totalIncome:income, 
            totalExpense:expense,
            totalSavings:savings,
            totalBalance:income - expense - savings,
        },
        });
    } else {
        res.status(200).json({
        status: 'NO_DATA_FOUND',
        data: {data:result, totalIncome:0, totalExpense:0, totalSavings:0, totalBalance:0},
        });
    }
  }catch(err){
    res.status(500).json({
        status: 'ERROR',
        message: err?err.message:"Something went wrong, Please try again!"
    });
  }
};