const ytdl = require('ytdl-core');

module.exports = {
    name: "youtube",
    description: "Plays a song from YouTube.",
    aliases: ['play', 'yt'],
    cooldown: 5,
    execute(message, args) {
      if (message.channel.type !== 'text') return;

      const {voiceChannel} = message.member;

      if (!voiceChannel) {
          return message.reply(`please join a voice channel first!`);
      }

      voiceChannel.join()
        .then(connection => {
            const stream = ytdl('https://www.youtube.com/watch?v=gIDBnt5fAE8', {filter: 'audioonly'});
            const dispatcher = connection.playStream(stream);

            dispatcher.on('end', () => voiceChannel.leave());
        });
    }
  };
  