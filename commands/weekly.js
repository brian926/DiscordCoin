const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { weeklyMin, weeklyMax } = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weekly")
        .setDescription("Redeem free coins every 7 days"),
    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { weeklyLastUsed } = profileData;

        const cooldown = 604800000;
        const timeLeft = cooldown - (Date.now() - weeklyLastUsed);

        await interaction.deferReply({ ephemeral: true });

        if (timeLeft > 0) {
            const { days, hours, minutes, seconds } = parseMilliseconds(timeLeft);
            return await interaction.editReply(`Claim your next daily in ${days} days ${hours} hrs ${minutes} min ${seconds} sec`);
        } else {
            const randomAmt = Math.floor(Math.random() * (weeklyMax + 1)) + weeklyMax;
            try {
                await profileModel.findOneAndUpdate(
                    { userId: id },
                    {
                        $set: {
                            weeklyLastUsed: Date.now(),
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