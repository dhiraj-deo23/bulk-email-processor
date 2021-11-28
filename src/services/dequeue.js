const amqp = require("amqplib/callback_api");
const { sendEmail } = require("../utils/send_mail");

const emaildeQueue = (id) => {
  amqp.connect("amqp://localhost", (connErr, connection) => {
    if (connErr) {
      throw new Error(connErr);
    }
    connection.createChannel((err, channel) => {
      if (err) {
        throw new Error(err);
      }
      const queueName = "emails";
      channel.assertQueue(queueName);

      channel.consume(queueName, (msg) => {
        const email = msg.content.toString();

        //sending emails
        sendEmail(email, id);
        channel.ack(msg);
      });
    });
  });
};

module.exports = emaildeQueue;
