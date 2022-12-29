const { getFiles, requireReload } = require("../utils/misc");
const path = require("path");
const chalk = require("chalk");

module.exports = {
  name: "interactionCreate",
  event: class InteractionCreate {
    constructor(commands, subcommands, events) {
      this.commands = commands;
      this.subcommands = subcommands;
      this.events = events;
    }

    async run(interaction) {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();
      try {
        const subcommandName = interaction.options.getSubcommand(false);
        const commandFiles = getFiles(path.join(process.cwd(), "src", "commands", (subcommandName ? interaction.commandName : "")));
        const findCommandFile = commandFiles.find(file => file.indexOf(`${(subcommandName ? subcommandName : interaction.commandName)}.js`) !== -1);
        const commandFile = requireReload(findCommandFile);
        const command = new (commandFile)(this.client, this.commands, this);

        command.run(interaction);
      } catch (error) {
        if (error instanceof TypeError) console.error(chalk.redBright(`An error occurred while executing (interactionCreate): ${error.message}`));
        else throw error;
      }
    }
  }
}
