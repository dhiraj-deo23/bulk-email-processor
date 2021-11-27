const amqp = require("amqplib/callback_api");

const emailQueue = (emails) => {
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
      emails.forEach((email) => {
        channel.sendToQueue(queueName, Buffer.from(email));
        console.log(`queue email sent: ${email}`);
      });
    });
  });
};

module.exports = emailQueue;
