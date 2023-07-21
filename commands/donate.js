const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("donate")
        .setDescription("Donate coins to another user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to donate to")
                .setRequired(true))
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount of coins you want to donate")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction, profileData) {
        const receiveUser = interaction.options.getUser("user");
        const donateAmt = interaction.options.getInteger("amount");
        const { balance } = profileData;

        if (balance < donateAmt) {
            await interaction.deferReply({ ephmeral: true })
            return await interaction.editReply(`You do not have enough coins. Balance is ${balance} and donation amount is ${donateAmt}`)
        } else {

            const receiveUserData = await profileModel.findOneAndUpdate(
                {
                    userId: receiveUser.id
                },
                {
                    $inc: {
                        balance: donateAmt,
                    },
                }
            );

            if (!receiveUserData) {
                await interaction.deferReply({ ephmeral: true });
                return await interaction.editReply(`${receiveUser.username} is not in the server`);
            }

            await interaction.deferReply();

            await profileModel.findOneAndUpdate(
                {
                    userId: interaction.user.id,
                },
                {
                    $inc: {
                        balacne: -donateAmt,
                    },
                }
            );

            interaction.editReply(`You have donated ${donateAmt} coins to user ${receiveUser.username}`);
        }
    },
};