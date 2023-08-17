const { Events, EmbedBuilder } = require("discord.js");
const levelModel = require("../models/levelSchema");

// Add XP for every message a user sends
// (Replies to messages do not count)
module.exports = {
    name: Events.MessageCreate,
    async execute(interaction) {
        const { guild, author } = interaction;
        if (author.bot) return;

        // Find user in the db, if no user then create one
        // Else, check level and if XP exceeds level then level up or just add XP
        let profileData;
        try {
            profileData = await levelModel.findOne({ userId: author.id, serverId: guild.id });
            if (!profileData) {
                profileData = await levelModel.create({
                    userId: author.id,
                    serverId: guild.id,
                });
            } else {
                const give = 1;
                const requireXP = profileData.level * profileData.level * 20 + 20;
                if (profileData.xp + give >= requireXP) {
                    profileData.xp += give;
                    profileData.level += 1;

                    try {
                        await profileData.save();
                    } catch (err) {
                        console.log(err);
                    }

                    const channel = await interaction.client.channels.cache.get(interaction.channelId);
                    // Send embed if leveled up
                    if (!channel) return;

                    const embed = new EmbedBuilder()
                        .setColor("Aqua")
                        .setDescription(`${author}, you have reached ${profileData.level}!`);

                    await channel.send({ embeds: [embed] }).catch(err => console.log(`--> Error sending level up message: ${err}`))
                } else {
                    profileData.xp += give;

                    try {
                        await profileData.save();
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};