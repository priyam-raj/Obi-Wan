const db = require("old-wio.db");

module.exports.help = {
  name: "changeprefix",
  category: "Config",
  description: "Change the prefix of Obi-Wan Bot (e.g. changeprefix !)",
  usage: "Setprefix [New Prefix]",
  run: async ({ message, args, Color, Default_Prefix }) => {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.channel.send(
        "You do not have the **Manage Server** permission."
      );

    const Prefix = (await db.fetch(`P-${message.guild.id}`)) || Default_Prefix;

    if (!args[0])
      return message.channel.send("Please enter a new prefix for the bot.");

    if (args[0].length > 6)
      return message.channel.send("Prefix too long (6 characters limit)");

    if (args[0] === Prefix)
      return message.channel.send("This prefix already exists");

    await db.set(`P-${message.guild.id}`, args[0]);

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          title: "Success",
          description: `The new prefix is now ${args[0]}`,
          footer: { text: `${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
