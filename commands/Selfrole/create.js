const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  parseEmoji,
} = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const selfRolePanelSchema = require("../../database/schemas/selfrole/panel.js");
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
        const filterChannel = (msg) => msg.author.id !== message.author.id;
        let channelCollector
        try {
        channelCollector = await message.channel.awaitMessages({
          filterChannel,
          max: 1,
          time: 15_000,
          errors: ['time']
        })
      }  catch(e) {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription("❌ | You took too long to respond!")
              .setColor(ee.wrongcolor),
          ],
        });
      }
      
          channel = channelCollector.first().mentions.channels.first() || message.guild.channels.cache.get(channelCollector.first().content);
          //         if (!channel) {
          //   return message.reply({
          //     embeds: [
          //       new EmbedBuilder()
          //         .setTitle("Selfrole Creation")
          //         .setColor(ee.color)
          //         .setDescription("❌ | You didn't mention a channel!"),
          //     ],
          //     allowedMentions: { repliedUser: false },
          //   });
          // }


          const btn_embed = new EmbedBuilder()
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "Should buttons display label only, emoji only or both? This action is irreversible!"
            )
          .setImage("https://cdn.discordapp.com/attachments/1109065674736816138/1109790776289939578/image.png");

          const btn_ask_msg = await channelCollector.first().reply({
            embeds: [btn_embed],
            allowedMentions: { repliedUser: false },
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("label_only")
                  .setLabel("Label Only")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("emoji_only")
                  .setLabel("Emoji Only")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("both")
                  .setLabel("Label & Emoji")
                  .setStyle(ButtonStyle.Success)
              ),
            ],
          });
          let btn_ask_collector
         try {
          btn_ask_collector = await btn_ask_msg.awaitMessageComponent({
            filter: (interaction) => interaction.user.id === message.author.id,
            time: 15_000,
            errors: ['time']
          })
         } catch(e) {
          await btn_ask_msg.delete();
            return message.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription("❌ | You took too long to respond!")
                  .setColor(ee.wrongcolor),
              ],
            });
          }
          const btn_ask = btn_ask_collector.customId;
          await btn_ask_msg.delete();
          if (btn_ask === "label_only" || btn_ask === "both") {
            const label_embed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "What should be the label of the button? This action is irreversible!"
              );
            const label_msg = await message.channel.send({ embeds: [label_embed] });
            let label_ask_collector
            try {
            label_ask_collector = await label_msg.channel.awaitMessages({
              filter: (msg) => msg.author.id === message.author.id,
              max: 1,
              time: 15_000,
              errors: ['time']
            })
            } catch(e) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setDescription("❌ | You took too long to respond!")
                    .setColor(ee.wrongcolor),
                ],
              });
            }
            const label_ask = label_ask_collector.first().content;
            if (!label_ask) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription("❌ | You didn't provide a label!"),
                ],  
                allowedMentions: { repliedUser: false },
              });
            }
          }
          if (btn_ask === "emoji_only" || btn_ask === "both") {
            const emoji_embed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "What should be the emoji of the button? This action is irreversible!"
              );
            const emoji_msg = await message.channel.send({ embeds: [emoji_embed] });
            let emoji_ask_collector
            try {
            emoji_ask_collector = await emoji_msg.channel.awaitMessages({
              filter: (msg) => msg.author.id === message.author.id,
              max: 1,
              time: 15_000,
              errors: ['time']
            })
            } catch(e) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setDescription("❌ | You took too long to respond!")
                    .setColor(ee.wrongcolor),
                ],
              });
            }
            const emoji_ask = parseEmoji(emoji_ask_collector.first().content);
            if (!emoji_ask) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription("❌ | You didn't provide an  valid emoji!"),
                ],
                allowedMentions: { repliedUser: false },
              });

            }
            console.log(emoji_ask.name.length)
            if(emoji_ask.id === undefined && emoji_ask.name.length > 2) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription("❌ | I cant put more than 1 deafult emoji!"),
                ],
                allowedMentions: { repliedUser: false },
              });
            } 
          }
          const btn_ask_style_embed = new EmbedBuilder()
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "What should be the style of the button? This action is irreversible!"
            )
            .setImage("https://i.imgur.com/mUbn7PJ.png");
          const btn_ask_style_msg = await message.channel.send({ 
            embeds: [btn_ask_style_embed],

            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("primary")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("secondary")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("success")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("danger")
                  .setLabel("Button")
                  .setStyle(ButtonStyle.Danger)
              ),
            ],
           });
            let btn_ask_style_collector
            try {
            btn_ask_style_collector = await btn_ask_style_msg.awaitMessageComponent({
              filter: (interaction) => interaction.user.id === message.author.id,
              time: 15_000,
              errors: ['time']
            })
            } catch(e) {
              await btn_ask_style_msg.delete();
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setDescription("❌ | You took too long to respond!")
                    .setColor(ee.wrongcolor),
                ],
              });
            }
            const btn_ask_style = btn_ask_style_collector.customId;
            await btn_ask_style_msg.delete();
            if (!btn_ask_style) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                  .setTitle("Selfrole Creation")
                  .setColor(ee.wrongcolor)
                  .setDescription("❌ | You didn't provide a style!"),
                ],
                allowedMentions: { repliedUser: false },
              });
            }
            
            const role_embed = new EmbedBuilder()
              .setTitle("Selfrole Creation")
              .setColor(ee.color)
              .setDescription(
                "Mention the role that will be given when the button is clicked"
              );
            const role_msg = await message.channel.send({ embeds: [role_embed] });
            let role_ask_collector
            try {
            role_ask_collector = await role_msg.channel.awaitMessages({
              filter: (msg) => msg.author.id === message.author.id,
              max: 1,
              time: 15_000,
              errors: ['time']
            })
            } catch(e) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()
                    .setDescription("❌ | You took too long to respond!")
                    .setColor(ee.wrongcolor),
                ],
              });
            }
            const role_ask = role_ask_collector.first().mentions.roles.first() || message.guild.roles.cache.get(role_ask_collector.first().content);
            if (!role_ask) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription("❌ | You didn't mention a role!"),
                ],
                allowedMentions: { repliedUser: false },
              });
            }
            const role = role_ask.id;
            const role_name = role_ask.name;
            const role_position = role_ask.position;


            if(role_position >= message.guild.me.roles.highest.position) {
              return message.reply({
                embeds: [
                  new EmbedBuilder()

                    .setTitle("Selfrole Creation")
                    .setColor(ee.color)
                    .setDescription("❌ | I cant give you a role higher than mine!"),
                ],
                allowedMentions: { repliedUser: false },
              });
            }
          const done_embed = new EmbedBuilder()
            
            .setTitle("Selfrole Creation")
            .setColor(ee.color)
            .setDescription(
              "Selfrole created successfully! Use them by using the `!selfrole show` command"
            );
          const done_msg = await message.channel.send({ embeds: [done_embed] });

          selfRolePanelSchema.findOne(
            {
              guildID: message.guild.id,
            },
            async (err, data) => {
              if (err) throw err;
              if (!data) {
                data = new selfRolePanelSchema({
                  _id: mongoose.Types.ObjectId(),
                  guildID: message.guild.id,
                  messageID: null,
                  channelID: null,
                  roles: [],
                });
              }
              data.roles.push({
                roleId: role,
                buttonID: `selfrole.${message.guild.id}.${role}`,
                buttonStyle: btn_ask_style,
                buttonType: btn_ask,
                buttonLabel: label_ask || undefined,
                buttonEmoji: emoji_ask || undefined,
              });
              data.save();
            }
          );
        } 
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
