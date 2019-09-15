module.exports = {
    name: "stop",
    description: "Stops the current streaming audio.",
    aliases: ['end', 'stop-audio', 'stop-stream'],
    cooldown: 5,
    execute(message, args) {
        const {voiceChannel} = message.member;

        if (!voiceChannel) {
            return message.reply(`you must be in a voice channel!`);
        }

        voiceChannel.leave();
    }
  };
  