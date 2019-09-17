module.exports = {
  name: "ping",
  description: "Ping!",
  // args: false,
  // usage: '[args]',
  // guildOnly: true,
  // cooldown: 5,
  execute(message, args) {
    message.channel.send("Pong.");
  }
};
