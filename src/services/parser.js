const { readFile, utils } = require("xlsx");
const excelParser = (filePath) => {
  const file = readFile(filePath);
  const sheets = file.SheetNames;
  let emails = [];
  for (let i = 0; i < sheets.length; i++) {
    const temp = utils
      .sheet_to_csv(file.Sheets[file.SheetNames[i]])
      .trim()
      .split("\n");
    emails = emails.concat(temp);
  }
  console.log(emails);
  return emails;
};

module.exports = {
  excelParser,
};
