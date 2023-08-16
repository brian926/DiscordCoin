const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { dailyMin, dailyMax } = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Redeem free coins every 24 hours"),
    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { dailyLastUsed } = profileData;

        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);

        await interaction.deferReply({ ephemeral: true });

        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            return await interaction.editReply(`Claim your next daily in ${hours} hrs ${minutes} min ${seconds} sec`);
        } else {
            const randomAmt = Math.floor(Math.random() * (dailyMax + 1)) + dailyMin;
            try {
                await profileModel.findOneAndUpdate(
                    { userId: id },
                    {
                        $set: {
                            dailyLastUsed: Date.now(),
                        },
                        $inc: {
                            balance: randomAmt,
                        }
                    }
                )
            } catch (err) {
                console.log(err);
            }
            return await interaction.editReply(`You redeemed ${randomAmt} coins!`);
        }

    },
};