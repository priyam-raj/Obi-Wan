const db = require("old-wio.db");

module.exports.help = {
  name: "help",
  aliases: ["h"],
  category: "Other",
  description: "Shows the commands of Obi-Wan.",
  usage: "Help | <Command Name>",
  run: async ({ client, message, args, Color, Support, Default_Prefix }) => {
    const Prefix = (await db.fetch(`P-${message.guild.id}`)) || Default_Prefix;

    const Config = [
      ...client.commands
        .filter((cmd) => cmd.help.category === "Config")
        .values(),
    ]
      .map((cmd) => "`" + cmd.help.name + "`")
      .join(", ");
    const Other = [
      ...client.commands
        .filter((cmd) => cmd.help.category === "Other")
        .values(),
    ]
      .map((cmd) => "`" + cmd.help.name + "`")
      .join(", ");

    if (!args[0])
      return message.channel.send({
        embeds: [
          {
            color: Color || "RANDOM",
            title: `Obi-Wan Commands`,
            thumbnail: { url: client.user.displayAvatarURL({ format: "jpg" }) },
            description: `Followed by **#help**, type any of the following commands for more details:\n\nThe current prefix is **'${Prefix}'** 
            \n\n**Config**\n${Config}\n\n**More**\n${Other}\n\n
            \Invite Obi-Wan - [Click Here](https://discord.com/oauth2/authorize?client_id=${
              client.user.id
            }&scope=bot&permissions=2048)`,
          },
        ],
      });

    const command =
      client.commands.find((cmd) => cmd.help.name === args[0].toLowerCase()) ||
      client.commands.find((cmd) => cmd.help.name === args[0].toLowerCase());

    if (!command)
      return message.channel.send({
        content: `No command found - ${
          args[0].charAt(0).toUpperCase() + args[0].slice(1)
        }`,
      });

    return message.channel.send({
      embeds: [
        {
          color: Color || "RANDOM",
          title: "Command information",
          thumbnail: { url: client.user.displayAvatarURL({ format: "jpg" }) },
          fields: [
            {
              name: "Name",
              value:
                command.help.name.charAt(0).toUpperCase() +
                command.help.name.slice(1),
              inline: true,
            },
            {
              name: "Category",
              value: command.help.category,
              inline: true,
            },
            {
              name: "Aliases",
              value: command.help.aliases
                ? command.help.aliases.join(", ")
                : "No Aliases",
              inline: true,
            },
            {
              name: "Usage",
              value: command.help.usage,
              inline: true,
            },
            {
              name: "Description",
              value: command.help.description,
            },
          ],
          footer: { text: `${message.author.username}` },
          timestamp: new Date(),
        },
      ],
    });
  },
};
