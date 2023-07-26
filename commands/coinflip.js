const { SlashCommandBuilder } = require("discord.js");
const { coinflipRewardMin, coinflipRewardMax } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Flip a coin for free bonus!")
        .addStringOption((option =>
            option
                .setName("choice")
                .setDescription("Heads or Tails")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Heads",
                        value: "Heads"
                    },
                    {
                        name: "Trails",
                        value: "Trails"
                    }
                ))),
    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { coinflipLastUsed } = profileData;

        const cooldown = 3600000;
        const timeLeft = cooldown - (Date.now() - coinflipLastUsed);

        if (timeLeft > 0) {
            await interaction.deferReply({ ephemeral: true });
            const { minutes, seconds } = parseMilliseconds(timeLeft);
            await interaction.editReply(`Claim your next daily in ${minutes} min ${seconds} sec`);
        } else {
            await interaction.deferReply();

            const randomNum = Math.round(Math.random());
            const result = randomNum ? "Heads" : "Trails";
            const choice = interaction.options.getString("choice");

            if (choice == result) {
                const randomAmt = Math.floor(Math.random() * (coinflipRewardMax - coinflipRewardMin + 1) + coinflipRewardMax);

                await profileModel.findOneAndUpdate(
                    {
                        userId: id
                    },
                    {
                        $set: {
                            coinflipLastUsed: Date.now(),
                        },
                        $inc: {
                            balance: randomAmt,
                        }
                    }
                );

                await interaction.editReply(`Winner! You've won ${randomAmt} coins with **${choice}** and the result was ${result}`)
            } else {
                await interaction.editReply(`You lost by choicing **${choice}** when it was **${result}**`);
            }
        }
    },
};