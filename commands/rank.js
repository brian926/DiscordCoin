const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const levelModel = require("../models/levelSchema");
const Canvacord = require("canvacord");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Gets a members rank in the server")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The member you want to check the rank of")
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user");

        const { guild } = interaction;
        const member = guild.members.cache.get(user.id);

        let data;
        try {
            data = await levelModel.findOne({ serverId: guild.id, userId: user.id });
        } catch (err) {
            console.log(err);
        }

        if (!data) {
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setDescription(`:white_check_mark: ${member}`);
            return await interaction.reply({ embeds: [embed] });
        }

        await interaction.deferReply();

        const Required = data.level * data.level * 20 + 20;

        const rank = new Canvacord.Rank()
            .setAvatar(member.displayAvatarURL({ forseStatic: true }))
            .setCurrentXP(data.xp)
            .setRequiredXP(Required)
            .setRank(0, "Rank", false)
            .setLevel(data.level, "Level")
            .setUsername(member.user.username)
            .setDiscriminator()

        const Card = await rank.build();
        const attachment = new AttachmentBuilder(Card, { name: "rank.png" });
        const embed2 = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`${member.user.username}'s Level/Rank`)
            .setImage("attachment://rank.png")

        await interaction.editReply({ embeds: [embed2], files: [attachment] })
    },
};