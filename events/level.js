const { Events, EmbedBuilder } = require("discord.js");
const levelModel = require("../models/levelSchema");

module.exports = {
    name: Events.MessageCreate,
    async execute(interaction) {
        const { guild, author } = interaction;

        // Get user db info and pass to command
        let profileData;
        try {
            profileData = await levelModel.findOne({ userId: author.id, serverId: guild.id });
            if (!profileData) {
                profileData = await levelModel.create({
                    userId: author.id,
                    serverId: guild.id,
                });
            }
        } catch (err) {
            console.log(err);
        }

        const channel = message.channel;
        const give = 1;

        try {
            const data = await levelModel.findOne({ userId: author.id, serverId: guild.id });
        } catch (err) {
            console.log(err);
        }

        const requireXP = data.level * data.level
        if (data.xp + give >= requireXP) {
            data.xp += give;
            data.level += 1;

            try {
                await data.save();
            } catch (err) {
                console.log(err)
            }

            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(`${author}, you have reached ${data.level}!`);

            channel.send({ embeds: [embed] });
        } else {
            data.xp += give;

            try {
                await data.save();
            } catch (err) {
                console.log(err)
            }
        }
    },
};