const { EmbedBuilder, codeBlock, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const stringSimilarity = require("string-similarity");

module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Info",
  aliases: ["h", "commandinfo", "cmds", "cmd", "halp"], //the command aliases [OPTIONAL]
  cooldown: 3, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "help [Commandname]", //the command usage [OPTIONAL]
  description: "Returns all Commmands, or one specific command", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "specific_cmd",
        description: "Want details of a Specific Command?",
        required: false,
      },
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: false, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 1, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  slashRun: async (client, interaction) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
      } = interaction;
      const { guild } = member;
      let prefix = client.config.prefix;
      let args = options.getString("specific_cmd");
      if (args && args.length > 0) {
        const embed = new EmbedBuilder();
        const cmd =
          client.commands.get(args.toLowerCase()) ||
          client.commands.get(client.aliases.get(args.toLowerCase()));
        if (!cmd) {
          const allcmds = client.commands.map((cmd) => cmd.name);
          const matches = stringSimilarity.findBestMatch(
            args.toLowerCase(),
            allcmds
          );
          const suggestions = matches.ratings
    .map((rating, index) => ({
      command: allcmds[index],
      rating: rating.rating
    }))
    .filter(suggestion => suggestion.rating > 0);
          const suggestionList = suggestions
          .map((suggestion, index) => `\`[${index + 1}]\` ${suggestion.command}`)
          .join('\n');
      
        return interaction.reply({
          ephemeral: true,
          embeds: [
            embed.setColor(ee.wrongcolor).setDescription(
              `No Information found for command **${args.toLowerCase()}** \nDo you mean this? \n> ${suggestionList}`
            ),
          ],
          });
        }
        if (cmd.name)
          embed.addFields({
            name: "**Command name**",
            value: `\`${cmd.name}\``,
          });
        if (cmd.name)
          embed.setTitle(`Detailed Information about:\`${cmd.name}\``);
        if (cmd.aliases)
          embed.addFields({
            name: "**Aliases**",
            value: `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``,
          });
        embed.addFields({
          name: "**Cooldown**",
          value: `\`${
            cmd.cooldown
              ? cmd.cooldown + " Seconds"
              : settings.default_cooldown_in_sec + " Second"
          }\``,
        });
        if (cmd.usage) {
          embed.addFields({
            name: "**Usage**",
            value: `\`${prefix}${cmd.usage}\``,
          });
          embed.setFooter({ text: ee.footertext, iconURL: ee.footericon });
        }
        embed.setDescription(`${codeBlock("diff", `- [] = optional argument
- <> = required argument
- Do NOT type these when using commands!`)}
> ${cmd.description}
`)
        return interaction.reply({
          ephemeral: true,
          embeds: [embed.setColor(ee.color)],
        });
      } else {
        const commands = (category) => {
          return client.slashCommands
            .filter((cmd) => cmd.category === category)
            .map((cmd) => `\`${cmd.name}\``);
        };
        const embed = new EmbedBuilder()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("HELP MENU 🔰 Commands")
          .setDescription(
            `- Prefix for this server is \`${prefix}\`
- Total commands: \`${client.commands.size}\`
- [Get ${client.config.botName}](${client.config.invite_url}) | [Support server](${client.config.support_server.invite}) | [Vote me](https://top.gg/bot/${client.user.id}/vote)
- Type \`${prefix}help <command | module>\` for more info.`
          )
          .setFooter({
            text: `To see command Descriptions and Information, type: ${prefix}help [CMD NAME]`,
            iconURL: client.user.displayAvatarURL(),
          });
        
        let options = [];
        try {
         
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            options.push({
              label: current,
              value: current.toLowerCase(),
              description: `Commands count ${items.length}`,
              emoji: client.allEmojis[current.toLowerCase()] ? client.allEmojis[current.toLowerCase()] : undefined,
            });
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        const msg = await interaction.reply({
          ephemeral: true,
          embeds: [embed],
          components: [
            new ActionRowBuilder().addComponents(
              new StringSelectMenuBuilder()
                .setCustomId("help_menu_select")
                .setPlaceholder("Select a Category")
                .setMinValues(1)
                .setMaxValues(1)
                .addOptions(options)
            ),
          ],
        });
        const filter_menu = (interaction) => interaction.customId === 'help_menu_select';
      let response
        try {
          collector = msg.createMessageComponentCollector({
            filter_menu,
            time: 30_000
          });
        } catch (error) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(ee.color)
                .setDescription(`You ran out of time! Try again!`),
            ],
          });
        }
        collector.on('collect', async (response) => {
        if(response.customId === 'help_menu_select') {
          const cat = response.values[0]
          const cat_embed = new EmbedBuilder()
          const items = commands(capitalizeFirstLetter(cat));
          cat_embed.setDescription(`**__${capitalizeFirstLetter(cat.toUpperCase())}__ [${items.length}]**\n \n - \`${items.join("\`, \`")}\``);
          interaction.editReply({
            embeds: [cat_embed],
          })
          response.deferUpdate();
        }
      })
      collector.on('end', async (response) => {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(ee.color)
              .setDescription(`${emote.x} | You ran out of time! Try again!`),
          ],
        });
      });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return interaction.followUp({
        ephemeral: true,
        embeds: [
          new EmbedBuilder()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(`${client.allEmojis.x} ERROR | An error occurred`)
            .setDescription(
              `\`\`\`${
                e.message
                  ? String(e.message).substr(0, 2000)
                  : String(e).substr(0, 2000)
              }\`\`\``
            ),
        ],
      });
    }
  },
  messageRun: async (
    client,
    message,
    args,
    plusArgs,
    cmdUser,
    text,
    prefix
  ) => {},
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}