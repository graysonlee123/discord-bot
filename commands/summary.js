const get = require("axios").get;
const Discord = require("discord.js");

module.exports = {
  name: "summary",
  description: "Gets a summary of the summoner.",
  args: true,
  usage: "<summonor-name>",
  cooldown: 5,
  // guildOnly: true,
  execute(message, args) {
    const summoner = args.join(" ");
    console.log(summoner);

    get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner
        .split(" ")
        .join("%20")}?api_key=${process.env.LEAGUE_API_KEY}`
    )
      .then(response => {
        const { data } = response;

        const embed = new Discord.RichEmbed()
          .setColor("#b38a3e")
          .setTitle(`${data.name}`)
          .setDescription(`Summoner Level ${data.summonerLevel}`)
          .setThumbnail(`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${data.profileIconId}.png`)

        message.channel.send(
          embed
        );
        console.log("Response:", response);
      })
      .catch(err => {
        console.log("Error:", err);
        message.reply(`there was an error with that summoner!`);
      });
  }
};
