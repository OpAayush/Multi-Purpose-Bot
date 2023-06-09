const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder,
  } = require("discord.js");
const { cleanCode, splitMessageRegex } = require("visa2discord")
const config = require("../../botconfig/config.js");
const ee = require("../../botconfig/embed.js");
const settings = require("../../botconfig/settings.js");
const {
    inspect
  } = require(`util`);
module.exports = {
	name: "eval", //the command name for the Slash Command
	slashName: "eval", //the command name for the Slash Command
  	category: "owner",
	aliases: ['e'], //the command aliases [OPTIONAL]
	description: "Run some code", //the command description for Slash Command Overview
	cooldown: 1,
	memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
	requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
	alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
	options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
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
			//let UserOption = options.getUser("OPTIONNAME");
			//let ChannelOption = options.getChannel("OPTIONNAME");
			//let RoleOption = options.getRole("OPTIONNAME");
		} catch (e) {
			console.log(String(e.stack).bgRed)
		}
	},
    messageRun: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        try {
            if (!args[0])
            return message.reply({
              content: `<:no:946581450600370298> You must provide a code to evaluate.`,
            });
        const code = args.join(" ");
        if (args.includes(`token`))
        return message.reply({ content: `No token grabbing for you!` });
      //get the evaled content
      let evaled;
      evaled = await eval(code);
      //make string out of the evaluation
      let string = cleanCode(inspect(evaled));
      //if the token is included return error
      if (string.includes(client.token))
        return message.reply({ content: `No token grabbing for you!` });
      //define queueembed
      let evalEmbed = new EmbedBuilder()
        .setTitle(`${client.user.username} | Evaluation`)
        .setColor("ffc0cb");
           
      //split the description
      const splitDescription = splitMessageRegex(string, {
        maxLength: 2000,
        char: `\n`,
        prepend: ``,
        append: ``,
      });
  
      //For every description send a new embed
      splitDescription.forEach(async (m) => {
   
        //(over)write embed description
        evalEmbed.setDescription(`\`\`\`` + m + `\`\`\``);
        //send embed
        
        message.channel.send({embeds: [evalEmbed]});
        });
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}

