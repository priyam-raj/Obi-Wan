const { Client, Collection } = require("discord.js"),
  { readdir } = require("fs");
  db = require("old-wio.db");
const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
});
const {
  Default_Prefix,
  Token,
  Support,
  Color,
} = require("./config.js");
(client.commands = new Collection()), (client.aliases = new Collection());

client.on("ready", () => {
  console.log(`Obi-Wan is ready!\nTag: ${client.user.tag}`);
  client.user.setActivity("KENOBI", { type: "WATCHING" });
});

const categories = ["Config", "Other"];

for (const category of categories) {
  readdir(`./commands/${category}`, (error, files) => {
    if (error) throw error;
    for (const file of files) {
      if (!file.endsWith(".js"))
        return console.info(`${file}: does not ends with .js!`);
      const command = require(`./commands/${category}/${file}`);
  
      client.commands.set(command.help.name, command);
      command.help.aliases
        ? command.help.aliases.forEach((alias) =>
            client.aliases.set(alias, command.help.name)
          )
        : (command.help.aliases = null);
    }
  });
}

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild || message.webhookID) return;

  const prefix = (await db.fetch(`P-${message.guild.id}`)) || Default_Prefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/g),
    cmd = args.shift().toLowerCase();
  const commandFromCmd =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));

  if (!commandFromCmd) return;

  try {
    commandFromCmd.help.run({
      client,
      message,
      args,
      Color,
      Default_Prefix,
      Support,
    });
  } 
  
  catch (error) {
    console.log(error);
    return message.channel.send("Something went wrong.");
  }


});

client.on("guildMemberAdd", async (member) => {
  const welcomeChannel = await db.fetch(`WC-${member.guild.id}`);
  if (!welcomeChannel) return;
  const welcomeMessage = (
    (await db.fetch(`WM-${member.guild.id}`)) ||
    `<a:obihellothere:975695669815832616> Hello there, <@${member.user.id}>.`
  )


  if (member.user.username.length > 25)
    member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15)
    member.guild.name = member.guild.name.slice(0, 15) + "...";


  return client.channels.cache.get(welcomeChannel).send({
    content: welcomeMessage,
  });
});

client.on("guildMemberRemove", async (member) => {
  const goodbyeChannel = await db.fetch(`GC-${member.guild.id}`);
  if (!goodbyeChannel) return;
  const goodbyeMessage = (
    (await db.fetch(`GM-${member.guild.id}`)) ||
    `<a:obigoodbye:975695669400596481> Farewell friend, ${member.user.username}.`
  )


  if (member.user.username.length > 25)
    member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15)
    member.guild.name = member.guild.name.slice(0, 15) + "...";


  return client.channels.cache.get(goodbyeChannel).send({
    content: goodbyeMessage,
  });
});

client
  .login(Token)
  .catch(() =>
    console.log(
      `Token Error`
    )
  );
