const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const levelModel = require("../models/levelSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Gets a members rank in the server")
        .addUserOption((option) => {
            option
                .setName("user")
                .setDescription("The member you want to check the rank of")
                .setRequired(true)
        }
        ),
    async execute(interaction, profileData) {
        const { options, guild } = interaction;

        const data = await levelModel.findOne({ serverId: guild.id, userId: profileData.userId });

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`:white_check_mark: ${profileData.userId}`)
    },
};