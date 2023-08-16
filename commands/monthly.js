const { SlashCommandBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { monthlyMin, monthlyMax } = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("monthly")
        .setDescription("Redeem free coins every 30 days"),
    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { monthlyLastUsed } = profileData;

        const cooldown = 2592000000;
        const timeLeft = cooldown - (Date.now() - monthlyLastUsed);

        await interaction.deferReply({ ephemeral: true });

        if (timeLeft > 0) {
            const { days, hours, minutes, seconds } = parseMilliseconds(timeLeft);
            return await interaction.editReply(`Claim your next daily in ${days} days ${hours} hrs ${minutes} min ${seconds} sec`);
        } else {
            const randomAmt = Math.floor(Math.random() * (monthlyMax + 1)) + monthlyMax;
            try {
                await profileModel.findOneAndUpdate(
                    { userId: id },
                    {
                        $set: {
                            monthlyLastUsed: Date.now(),
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