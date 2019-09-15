module.exports = {
  name: "purge",
  description: "Purges (deletes) messages.",
  execute(message, args) {
    const min = 2;
    const max = 100;

    const amount = parseInt(args[0]) + 1;

    if (isNaN(amount)) {
      return message.reply(`that doesn't seem to be a valid number.`);
    } else if (amount <= min || amount >= max) {
      return message.reply(
        `you need to input a number between ${min} and ${max}.`
      );
    }

    message.channel.bulkDelete(amount, true).catch(err => {
      console.log(err);
      message.reply(
        "there was an error trying to purge messages in this channel!"
      );
    });
  }
};
