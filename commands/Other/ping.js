module.exports.help = {
  name: "ping",
  category: "Other",
  description: "Shows the latency from you to the Obi-Wan Bot's server.",
  usage: "Ping",
  run: ({ client, message, Color }) => {
    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          description: `Pong! ${client.ws.ping}ms`,

        },
      ],
    });
  },
};
