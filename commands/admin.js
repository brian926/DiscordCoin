const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Access to all the admin commands")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add coins to a user's balance")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to add coins to")
                        .setRequired(true))
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("Amount of coins to add")
                        .setRequired(true)
                        .setMinValue(1)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("subtract")
                .setDescription("Subtract coins from a user's balance")
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user you want to add subtract from")
                        .setRequired(true))
                .addIntegerOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("Amount of coins to subtract")
                        .setRequired(true)
                        .setMinValue(1)
                )
        ),
    async execute(interaction, profileData) {
        await interaction.deferReply({ ephemeral: true });

        const adminSubcommand = interaction.options.getSubcommand();

        if (adminSubcommand === "add") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");

            await profileModel.findOneAndUpdate(
                {
                    userId: user.id,
                },
                {
                    $inc: {
                        balance: amount,
                    }
                }
            );

            await interaction.editReply(`Added ${amount} coins to ${user.username}'s balance`)
        } else if (adminSubcommand === "subtract") {
            const user = interaction.options.getUser("user");
            const amount = interaction.options.getInteger("amount");

            const data = await profileModel.findOne(
                {
                    userId: user.id,
                }
            );

            if (amount > data.balance) {
                await interaction.editReply(`Cannot subtract ${amount} from ${user.username}, amount is larger than ${user.username}'s balance of ${data.balance}`)
            } else {
                await profileModel.findOneAndUpdate(
                    {
                        userId: user.id,
                    },
                    {
                        $inc: {
                            balance: -amount,
                        }
                    }
                );

                await interaction.editReply(`Subtracted ${amount} coins to ${user.username}'s balance`)
            }
        }
    },
};