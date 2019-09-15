const ytdl = require('ytdl-core');

module.exports = {
    name: "youtube",
    description: "Plays a song from YouTube.",
    usage: '<youtube-video-url> [volume]',
    aliases: ['play', 'yt'],
    cooldown: 1,
    execute(message, args) {
      if (message.channel.type !== 'text') return;

      let playing = false;
      const {voiceChannel} = message.member;

      if (!voiceChannel) {
          return message.reply(`please join a voice channel first!`);
      }

      const volume = parseFloat(args[1]) || 0.1;

      if (volume < 0 || volume > 2) {
        return message.reply(`volume must be between 0 and 2! Default: 0.1`);
      }

      const defaultUrl = 'https://www.youtube.com/watch?v=Ll10d1Y9wU4';
      const url = args[0] || defaultUrl;

      if (url === defaultUrl) {
        message.reply(`please provide a YouTube video URL!`);
      }

      voiceChannel.join()
        .then(connection => {
          
          if (connection.speaking) return message.channel.send(`I\'m already playing audio!}`);
          
          const stream = ytdl(url, {filter: 'audioonly'});
          const dispatcher = connection.playStream(stream);

          dispatcher.setVolume(volume);
          dispatcher.on('end', () => voiceChannel.leave());
        }).catch(err => {
          message.reply(`there was an error with that URL!`);
          console.log(err);
        })
    }
  };
  