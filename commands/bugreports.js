const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Send a bug report to the bot's devs"),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setTitle("Bug & Command Abuse Reporting")
            .setCustomId("bugreport");

        const commmand = new TextInputBuilder()
            .setCustomId("command")
            .setRequired(true)
            .setPlaceholder("Please only state the command name")
            .setLabel("What command has a bug or has been abused")
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId("description")
            .setRequired(true)
            .setPlaceholder("Be sure to be as detailed as possible so the devs can take action")
            .setLabel("Describe the bug of command abuse")
            .setStyle(TextInputStyle.Paragraph);

        const one = new ActionRowBuilder().addComponents(commmand);
        const two = new ActionRowBuilder().addComponents(description);

        modal.addComponents(one, two);
        await interaction.showModal(modal);
    },
};