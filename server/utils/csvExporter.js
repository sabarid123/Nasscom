const { Parser } = require('json2csv');

const exportToCSV = (data, fields) => {
  try {
    const json2csvParser = new Parser({ fields });
    return json2csvParser.parse(data);
  } catch (error) {
    throw error;
  }
};

module.exports = { exportToCSV };
