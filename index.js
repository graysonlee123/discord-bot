const { token, prefix } = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", message => {
  // If the message doesn't have a prefix, or if it is from the bot itself, return
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // Adds a space after the command prefix
  const args = message.content.slice(prefix.length).split(" ");
  // shift() will take the first element in array and return it while also removing it from the original array
  const command = args.shift().toLowerCase();

  if (command === "args-info") {
    if (!args.length) {
      return message.channel.send(
        `You didn't provide any arguments, ${message.author}!`
      );
    } else if (args[0] === "foo") {
      return message.channel.send("bar");
    }

    message.channel.send(`Command name: ${command}\nArguments: ${args}`);
  }
});

client.login(token);
