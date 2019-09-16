const Discord = require('discord.js');

module.exports = {
    name: "add",
    description: "Add to the queue!",
    args: true,
    usage: 'url',
    cooldown: 0,
    execute(message, args) {
        const queue = new Discord.Collection();
        queue.set(args[0], 'test');
        console.log(queue);
        message.channel.send("Pong.");
    }
  };
  