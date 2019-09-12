const { token, prefix } = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", message => {
  // If the message doesn't have a prefix, or if it is from the bot itself, return
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Grabs the arguments after the space in the arguments
  const args = message.content.slice(prefix.length).split(" ");
  // shift() will take the first element in array and return it while also removing it from the original array
  const command = args.shift().toLowerCase();

  if (message.content.startsWith(`${prefix}join`)) {
    message.channel.send("I got the join request! Epic.");
  } else if (message.content.startsWith(`${prefix}leave`)) {
    message.channel.send("I got the leave request... bummer...");
  } else if (message.content === `${prefix}server`) {
    message.channel.send(`This server's name is: ${message.guild.name}
    Total members: ${message.guild.memberCount}
    Created: ${message.guild.createdAt}
    Owner: ${message.guild.owner}`);
  } else if (message.content === `${prefix}user-info`) {
    message.channel.send(`Your username: ${message.author.username}
    Your ID: ${message.author.id}`);
  }
});

client.login(token);
