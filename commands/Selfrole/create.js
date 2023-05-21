const { EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
module.exports = {
  name: "selfrole create", //the command name for the Slash Command
  slashName: "create", //the command name for the Slash Command
  category: "Selfrole",
  aliases: ["src"], //the command aliases [OPTIONAL]
  description: "Create selfroles in your server", //the command description for Slash Command Overview
  cooldown: 10,
  memberpermissions: ["ManageRoles"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    // {
    // 	"StringChoices": {
    // 		name: "what_ping",
    // 		description: "What Ping do you want to get?",
    // 		required: false,
    // 		choices: [
    // 			["Bot", "botping"],
    // 			["Discord Api", "api"]
    // 		]
    // 	}
    // }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  usage: "", //the Command usage [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
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
    } catch (e) {
      console.log(String(e.stack).bgRed);
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
  ) => {
    try {
      let channel = undefined;

      if (args) {
        channel =
          message.mentions.channels.first() ||
          message.guild.channels.cache.get(args[0]);
        if (!channel) channel = undefined;
      }
      if (!channel) {
        message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "Mention the channel where the selfrole will be created"
              ),
          ],
          allowedMentions: { repliedUser: false },
        });
        const filterChannel = (msg) => msg.author.id === message.author.id;
        const channelCollector = message.channel.createMessageCollector({
          filterChannel,
          max: 1,
          time: 15_000,
        });
        channelCollector.on("collect", async (msg) => {
          channel =
            msg.mentions.channels.first() ||
            msg.guild.channels.cache.get(msg.content);
          if (!channel) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription("❌ | You didn't mention a channel!"),
              ],
              allowedMentions: { repliedUser: false },
            });
          }
          const btn_embed = new EmbedBuilder()
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription("Should buttons display label only, emoji only or both? This action is irreversible!")
           // .setImage("");

            msg.reply({
              embeds: [btn_embed],
              allowedMentions: { repliedUser: false },
              components: [
                new ActionRowBuilder().addComponents(
                  new MessageButton()
                    .setCustomId("label_only")
                    .setLabel("Label Only")
                    .setStyle(ButtonStyle.PRIMARY),
                  new MessageButton()
                    .setCustomId("emoji_only")
                    .setLabel("Emoji Only")
                    .setStyle(ButtonStyle.PRIMARY),
                  new MessageButton()
                    .setCustomId("both")
                    .setLabel("Label & Emoji")
                    .setStyle(ButtonStyle.PRIMARY)
                ),
              ],
            })
            let btn_style = undefined;
            const filterButton = (interaction) => interaction.user.id === msg.author.id;
          const channelButton = msg.channel.createMessageComponentCollector({ filter, time: 15_000 });
          channelButton.on("collect", async (interaction) => {
            if (interaction.customId === "label_only") {
              btn_style = "label_only";
            } else if (interaction.customId === "emoji_only") {
              btn_style = "emoji_only";
            } else if (interaction.customId === "both") {
              btn_style = "both";
            }
          });
          channelButton.on("end", (collected) => {

          })
        });
        channelCollector.on("end", (collected) => {
          if (!channel) {
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.color)
                  .setDescription(
                    "❌ | You didn't mention a channel and the time ran out!"
                  ),
              ],
              allowedMentions: { repliedUser: false },
            });
          }
        });

      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
