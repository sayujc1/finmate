var days = function (month, year) {
  return new Date(year, month, 0).getDate();
};

module.exports = { days };
