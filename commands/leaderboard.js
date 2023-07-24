const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const porfileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows top 10 Coin Earners!"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { balance } = profileData;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("**Top 10 Coin Eaners**")
            .setColor(0x45d6fd)
            .setFooter({ text: "You aren't ranked yet" });

        const members = await porfileModel.find().sort({ balance: -1 }).catch((err) => console.log(err));

        const memberIndex = members.findIndex((member) => member.userId === id);
        leaderboardEmbed.setFooter({ text: `${username}, your rank #${memberIndex + 1} with ${balance}` });

        const topTen = members.slice(0, 10);

        let desc = "";
        for (let i = 0; i < topTen.length; i++) {
            let { user } = await interaction.guild.members.fetch(topTen[i].userId);
            if (!user) return;

            let userBalance = topTen[i].balance;
            desc += `**${i + 1}. ${user.username}:** ${userBalance} coins\n`;
        }

        if (desc != "") {
            leaderboardEmbed.setDescription(desc);
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });
    },
};