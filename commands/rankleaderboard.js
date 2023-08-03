const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const levelSchema = require("../models/levelSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("xp-leaderboard")
        .setDescription("Shows the server's xp leaderboard"),
    async execute(interaction) {
        const { guild, client } = interaction;
        let text = "";

        let Data;
        try {
            Data = await levelSchema.find({ serverId: guild.id })
                .sort({
                    xp: -1,
                    level: -1
                })
                .limit(10);
        } catch (err) {
            console.log(err);
        }

        if (!Data) {
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: No one is on the leaderboard yet...`);

            return await interaction.reply({ embeds: [embed] })
        };

        await interaction.deferReply();

        for (let counter = 0; counter < Data.length; ++counter) {
            let { userId, xp, level } = Data[counter];
            const value = await client.users.fetch(userId) || "Unkown Member";
            const member = value.tag;

            text += `${counter + 1}. ${member} | XP: ${xp} | Level: ${level} \n`;
        }

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${interaction.guild.name}'s XP Leaderboard:`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: "XP Leaderboard" });

        interaction.editReply({ embeds: [embed] });
    },
};