const { readdirSync, lstatSync } = require("fs");
const { SlashCommandBuilder } = require('discord.js');
const config = require("../botconfig/config.js");
const dirSetup = config.dirSetup;
module.exports = (client) => {
    try {
		let allCommands = [];
        readdirSync("./commands/").forEach((dir) => {
			if(lstatSync(`./commands/${dir}`).isDirectory()) {
				const cmdSetup = dirSetup.find(d=>d.Folder == dir);
				//If its a valid cmdsetup
				if(cmdSetup && cmdSetup.Folder) {
					//Set the SubCommand as a Slash Builder
					const subCommand = new SlashCommandBuilder().setName(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase()).setDescription(String(cmdSetup.CmdDescription));
					//Now for each file in that subcommand, add a command!
					const slashCommands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
					for (let file of slashCommands) {
						let pull = require(`../commands/${dir}/${file}`);
						if (pull.slashName && pull.description) {
							subCommand
							.addSubcommand((subcommand) => {
								subcommand.setName(String(pull.slashName).toLowerCase()).setDescription(pull.description)
								if(pull.options && pull.options.length > 0){
									for(const option of pull.options){
										if(option.User && option.User.name && option.User.description){
											subcommand.addUserOption((op) =>
												op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required).setAutocomplete(option.User.autocomplete? true: false)
											)
										} else if(option.Integer && option.Integer.name && option.Integer.description){
											subcommand.addIntegerOption((op) =>
												op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required).setAutocomplete(option.Integer.autocomplete? true: false)
											)
										} else if(option.String && option.String.name && option.String.description){
											subcommand.addStringOption((op) =>
												op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required).setAutocomplete(option.String.autocomplete? true: false)
											)
										} else if(option.Channel && option.Channel.name && option.Channel.description){
											subcommand.addChannelOption((op) =>
												op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
											)
										} else if(option.Role && option.Role.name && option.Role.description){
											subcommand.addRoleOption((op) =>
												op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
											)
										} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
                      const choices = option.StringChoices.choices.map(c => ({ name: String(c[0]).replace(/\s+/g, '_').toLowerCase(), value: c[1] }));
											subcommand.addStringOption((op) =>
												op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required).setAutocomplete(option.StringChoices.autocomplete? true: false)
												.addChoices(...choices),
											)
										} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
											subcommand.addStringOption((op) =>
												op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required).setAutocomplete(option.IntChoices.autocomplete? true: false)
												.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
											)
										} else if(option.Attachment && option.Attachment.name && option.Attachment.description) {
                      subcommand.addAttachmentOption((op) =>
												op.setName(String(option.Attachment.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Attachment.description).setRequired(option.Attachment.required).setAutocomplete(option.Attachment.autocomplete? true: false)
											)
                    } else {
											console.log(`A Option is missing the Name or/and the Description of ${pull.slashName}`)
										}
									}
								}
								return subcommand;
							})
							client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.slashName, pull)
						} else {
							console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
							continue;
						}
					}
					//add the subcommand to the array
					allCommands.push(subCommand.toJSON());
				} 
				else {
					return console.log(`The Subcommand-Folder ${dir} is not in the dirSetup Configuration!`);
				}
			} else {
				let pull = require(`../commands/${dir}`);
				if (pull.slashName && pull.description) {
					let Command = new SlashCommandBuilder().setName(String(pull.slashName).toLowerCase()).setDescription(pull.description);
						if(pull.options && pull.options.length > 0){
							for(const option of pull.options){
								if(option.User && option.User.name && option.User.description){
									Command.addUserOption((op) =>
										op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required).setAutocomplete(option.User.autocomplete? true: false)
									)
								} else if(option.Integer && option.Integer.name && option.Integer.description){
									Command.addIntegerOption((op) =>
										op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required).setAutocomplete(option.Integer.autocomplete? true: false)
									)
								} else if(option.String && option.String.name && option.String.description){
									Command.addStringOption((op) =>
										op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required).setAutocomplete(option.String.autocomplete? true: false)
									)
								} else if(option.Channel && option.Channel.name && option.Channel.description){
									Command.addChannelOption((op) =>
										op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required).setAutocomplete(option.Channel.autocomplete? true: false)
									)
								} else if(option.Role && option.Role.name && option.Role.description){
									Command.addRoleOption((op) =>
										op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required).setAutocomplete(option.Role.autocomplete? true: false)
									)
								} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
									Command.addStringOption((op) =>
										op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required).setAutocomplete(option.StringChoices.autocomplete? true: false)
										.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
									)
								} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
									Command.addStringOption((op) =>
										op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required).setAutocomplete(option.IntChoices.autocomplete? true: false)
										.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
									)
								} else {
									console.log(`A Option is missing the Name or/and the Description of ${pull.slashName}`)
								}
							}
						}
						allCommands.push(Command.toJSON());
						client.slashCommands.set("normal" + pull.slashName, pull)
				} 
				else {
					console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
				}
			}
        });
        
		//Once the Bot is ready, add all Slas Commands to each guild
		client.on("ready", () => {
			if(config.loadSlashsGlobal){
				client.application.commands.set(allCommands)
				.then(slashCommandsData => {
					client.slashCommandsData = slashCommandsData;
					console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for all: ${`All possible Guilds`.underline}`.brightGreen); 
					console.log(`Because u are Using Global Settings, it can take up to 1 hour until the Commands are changed!`.bold.yellow)
				}).catch(console.error);
			} else {
				client.guilds.cache.map(g => g).forEach(async (guild) => {
					try{
						await guild.commands.set([]).catch((e)=>{});
						guild.commands.set(allCommands)
						.then(slashCommandsData => {
							client.slashCommandsData = slashCommandsData;
							console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen); 
						}).catch(console.error);
					}catch (e){
						console.log(String(e).grey)
					}
				});
			}
		})
		//DISABLE WHEN USING GLOBAL!
		client.on("guildCreate", async (guild) => {
			try{
				if(!config.loadSlashsGlobal){
					await guild.commands.set([]).catch((e)=>{});
					guild.commands.set(allCommands)
						.then(slashCommandsData => {
							console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen); 
						}).catch((e)=>{});
				}
			}catch (e){
				console.log(String(e).grey)
			}
		})
		
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};
