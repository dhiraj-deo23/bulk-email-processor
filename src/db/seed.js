const faker = require("faker");
const Email = require("../Model/Email");

const emailTemplate = Array.from({ length: 10 }).map(() => ({
  to: "",
  from: "",
  subject: faker.lorem.word(),
  text: faker.lorem.text(),
  html: faker.lorem.sentence(),
}));

const seedEmailtoDb = async () => {
  try {
    const emailTemplateExist = await Email.exists();
    if (!emailTemplateExist) {
      return await Email.insertMany(emailTemplate);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = seedEmailtoDb;
