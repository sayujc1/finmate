const { days } = require('./daysHelper');
exports.viewIncrementResponse = rows => {
  let response = [];
  rows.forEach(item => {
    let obj = {};
    obj.t_id = item.t_id;
    obj.s_id = item.s_id;
    obj.d_id = item.d_id;
    obj.dep_id = item.dep_id;
    obj.department = item.department;
    obj.name = item.name;
    obj.designation = item.designation;
    obj.basic_s = item.basic_s;
    obj.increment_type = item.increment_type;
    obj.increment = item.increment;
    obj.monthly_s = item.monthly_s;
    obj.gender = item.gender;
    obj.daysOfMonth = days(item.month, item.year);
    response.push(obj);
  });
  return response;
};
