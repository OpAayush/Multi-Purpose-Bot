const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
  } = require("discord.js");
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
module.exports = {
	name: "kick", //the command name for the Slash Command
	slashName: "kick", //the command name for the Slash Command
  	category: "Moderation",
	aliases: [], //the command aliases [OPTIONAL]
	description: "Kick a user.", //the command description for Slash Command Overview
	cooldown: 1,
	memberpermissions: ["KickMembers"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
		//INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
		//{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
		//
		{"User": { name: "user", description: "user to kick", required: true }}, //to use in the code: interacton.getUser("ping_a_user")
        {"String": { name: "reason", description: "reason to kick the selected user", required: true }}, //to use in the code: interacton.getString("ping_amount")
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
	usage: "",  //the Command usage [OPTIONAL]
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
				createdTimestamp
			} = interaction;
			const {
				guild
			} = member;
			//let IntOption = options.getInteger("OPTIONNAME"); //same as in IntChoices
			//const StringOption = options.getString("what_ping"); //same as in StringChoices
            const member = await interaction.guild.members.fetch(interaction.options.getUser('user').id);
  const reason = interaction.options.getString('reason') || 'Not given';
const embed = new EmbedBuilder()
.setTitle("🔨・Kicked")
.setDescription("You've been kicked in **${interaction.guild.name}**")
.setThumbnail(interaction.guild.iconURL())
.addFields(
    { name: '👤┆Kicked by', value: interaction.user.tag, inline: true },
    { name: '💬┆Reason', value: reason, inline: true },
)
member.send({ embeds: [embed] })
.then(function() {
    member.kick(reason)
const embed1 = new EmbedBuilder()
.setTitle("🔨・Kicked Successfully")
.setDescription(`Successfully kicked **${member.user.tag}** and sent him the notification.`)
.addFields(
    { name: '💬┆Reason', value: reason, inline: true },
)
await interaction.reply({ embeds: [embed1] })
        }).catch(function() {
            member.kick(reason)
            const embed2 = new EmbedBuilder()
            .setTitle("🔨・Kicked Successfully")
            .setDescription(`Successfully kicked **${member.user.tag}** for \n\`\`\`yaml\n${reason}\n\`\`\`\n, notification **not** sent!`)
        })
			//let ChannelOption = options.getChannel("OPTIONNAME");
			//let RoleOption = options.getRole("OPTIONNAME");
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	},
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try {

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}

