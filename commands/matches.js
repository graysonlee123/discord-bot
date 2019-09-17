const get = require("axios").get;
const Discord = require("discord.js");
const moment = require("moment");

module.exports = {
  name: "lastmatch",
  description: "Gets the player's most recent match.",
  args: true,
  usage: "<summonor-name>",
  cooldown: 5,
  // guildOnly: true,
  execute(message, args) {
    const summoner = args.join(" ");

    get(
      `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summoner
        .split(" ")
        .join("%20")}?api_key=${process.env.LEAGUE_API_KEY}`
    )
      .then(({ data: { profileIconId, name, summonerLevel, accountId } }) => {
        get(
          `https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?endIndex=1&api_key=${process.env.LEAGUE_API_KEY}`
        )
          .then(({ data: { matches, startIndex, endIndex, totalGames } }) => {
            matches.forEach(match => {
              get(`
                https://na1.api.riotgames.com/lol/match/v4/matches/${match.gameId}?api_key=${process.env.LEAGUE_API_KEY}
              `)
                .then(
                  ({
                    data: {
                      gameId,
                      gameCreation,
                      gameDuration,
                      queueId,
                      mapId,
                      seasonId,
                      gameVersion,
                      gameMode,
                      gameType,
                      teams,
                      participants,
                      participantIdentities
                    }
                  }) => {
                    const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${profileIconId}.png`;

                    let gameQueueDescription;
                    switch (queueId) {
                      case 420:
                        gameQueueDescription = "Ranked Solos";
                        break;
                      case 400:
                        gameQueueDescription = "Draft Pick";
                        break;
                      case 430:
                        gameQueueDescription = "Blind Pick";
                        break;
                      case 440:
                        gameQueueDescription = "Ranked Flex";
                        break;
                      case 450:
                        gameQueueDescription = "ARAM";
                        break;
                      default:
                        gameQueueDescription = "Unknown";
                        break;
                    }

                    const [blueTeam, redTeam] = teams;

                    let participant;
                    participantIdentities.forEach(item => {
                      if (item.player.accountId === accountId) {
                        const participantId = item.participantId;

                        participants.forEach(item => {
                          if (item.participantId === participantId) {
                            participant = item;
                          }
                        })
                      }
                    });

                    const matchEmbed = new Discord.RichEmbed()
                      .setColor("#b38a3e")
                      .setAuthor(summoner, profileIconUrl)
                      .setThumbnail(profileIconUrl)
                      .setTitle(gameQueueDescription)
                      .setDescription(
                        `Match from ${moment(gameCreation).format(
                          "MMMM Do, h:mm a"
                        )}\nDuration: ${Math.floor(gameDuration / 60)}:${gameDuration % 60}`
                      )
                      .addBlankField()
                      .addField(
                        "Red Team",
                        `${redTeam.win === "Win" ? "**Win**" : "Lose"}` +
                          `\nTowers: ${redTeam.towerKills}` +
                          `\nDragons: ${redTeam.dragonKills}` +
                          `\nBarons: ${redTeam.baronKills}` +
                          `\nRift Herald: ${
                            blueTeam.firstRiftHerald === false ? "True" : "False"
                          }` +
                          `\nFirst blood: ${
                            blueTeam.firstBlood === false ? "True" : "False"
                          }` +
                          `\nFirst tower: ${
                            blueTeam.firstTower === false ? "True" : "False"
                          }`,
                        true
                      )
                      .addField(
                        "Blue Team",
                        `${blueTeam.win === "Win" ? "**Win**" : "Lose"}` +
                          `\nTowers: ${blueTeam.towerKills}` +
                          `\nDragons: ${blueTeam.dragonKills}` +
                          `\nBarons: ${blueTeam.baronKills}` +
                          `\nRift Herald: ${
                            redTeam.firstRiftHerald === false ? "True" : "False"
                          }` +
                          `\nFirst blood: ${
                            redTeam.firstBlood === false ? "True" : "False"
                          }` +
                          `\nFirst tower: ${
                            redTeam.firstTower === false ? "True" : "False"
                          }`,
                        true
                      )
                      .addBlankField()
                      .addField(
                        "Team",
                        `${participant.teamId === 100 ? 'Blue' : 'Red'}`,
                        true
                      )
                      .addField(
                        "Lane",
                        participant.timeline.lane,
                        true
                      )
                      .addField(
                        "Vision",
                        `Score: ${participant.stats.visionScore}\nWards Placed: ${participant.stats.wardsPlaced}\nWards Bought: ${participant.stats.visionWardsBoughtInGame}\nWards Killed: ${participant.stats.wardsKilled}`,
                        true
                      )
                      .addField(
                        "KDA",
                        `${participant.stats.kills}/${participant.stats.deaths}/${participant.stats.assists}` + 
                        `\nKilling sprees: ${participant.stats.killingSprees}`,
                        true
                      )
                      .addField(
                        "Damage Dealt",
                        `Total damage: ${participant.stats.totalDamageDealt}` +
                        `\nTotal damage to Champions: ${participant.stats.totalDamageDealtToChampions}` +
                        `\nPhysical damage: ${participant.stats.physicalDamageDealt}` +
                        `\nPhysical damage to Champions: ${participant.stats.physicalDamageDealtToChampions}` +
                        `\nMagic damage: ${participant.stats.magicDamageDealt}` +
                        `\nMagic damage to Champions: ${participant.stats.magicDamageDealtToChampions}` +
                        `\nTrue damage: ${participant.stats.trueDamageDealt}` +
                        `\nTrue damage to Champions: ${participant.stats.trueDamageDealtToChampions}`,
                        true
                      )
                      .addField(
                        "Damage Taken",
                        `Total damage: ${participant.stats.totalDamageTaken}` +
                        `\nPhysical damage: ${participant.stats.physicalDamageTaken}` + 
                        `\nMagic damage: ${participant.stats.magicalDamageTaken}` +
                        `\nTrue damage: ${participant.stats.trueDamageTaken}`,
                        true
                      )
                      .addField(
                        "Gold",
                        `**Creep Score**: ${participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled}` +
                        `\nGold Earned: ${participant.stats.goldEarned}` + 
                        `\nGold Spent: ${participant.stats.goldSpent}`,
                        true
                      )
                      .setFooter(
                        `League Version ${gameVersion}. Season ${seasonId}`
                      );

                    message.channel.send(matchEmbed);
                  }
                )
                .catch(err => {
                  console.log(err);
                });
            });
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log("Error:", err);
        message.reply(`there was an error with that summoner!`);
      });
  }
};
