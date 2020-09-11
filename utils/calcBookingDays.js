const calculateBookingDays = (startDate, endDate) => {
   startDate = new Date(startDate).getTime();
   endDate = new Date(endDate).getTime();
   return (endDate - startDate) / (1000 * 60 * 60 * 24);
};

module.exports = calculateBookingDays;
