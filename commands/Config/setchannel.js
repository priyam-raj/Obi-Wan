const db = require("old-wio.db");

module.exports.help = {
  name: "setchannel",
  aliases: ["sethellothere"],
  category: "Config",
  description: "Set the welcome or the goodbye channel.",
  usage: "Setchannel <Mention Channel> <Type>",
  run: async ({ message, args, Color }) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message.channel.send(
        "You do not have the **Manage Channels** permission."
      );

    const mentionedChannel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!mentionedChannel || mentionedChannel.type === "voice")
      return message.channel.send(`Please enter a valid text channel!`);

    const Welcome = ["welcome", "wel", "join"],
      Goodbye = ["goodbye", "leave", "left"];

    if (
      !args[1] ||
      ![...Welcome, ...Goodbye].find((T) => T === args[1].toLowerCase())
    )
      return message.channel.send(
        `Please enter a valid type - ${[...Welcome, Goodbye].join(", ")}`
      );

    const Current = Welcome.some((wel) => wel === args[1].toLowerCase())
      ? "Welcome"
      : "Goodbye";

    await db.set(
      `${Current === "Welcome" ? `WC` : `GC`}-${message.guild.id}`,
      mentionedChannel.id
    );

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          title: "Success",
          description: `${Current} channel has now been set - <#${mentionedChannel.id}>`,
          footer: { text: `${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
