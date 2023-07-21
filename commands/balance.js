const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Shows a user their balance"),
    async execute(interaction, profileData) {
        const { balance } = profileData;
        const userName = interaction.user.username;

        await interaction.reply(`${userName} has ${balance} coins`);
    },
};