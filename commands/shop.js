const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");
const { customRoleCost } = require("../shopPrices.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shop for your coins")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-role")
                .setDescription(`Buy a custom role for ${customRoleCost} coins`)
                .addStringOption((option) =>
                    option
                        .setName("name")
                        .setDescription("Choose the name of your role")
                        .setMinLength(2)
                        .setMaxLength(25)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("color")
                        .setDescription("Choose a color for your role")
                        .addChoices(
                            { name: "Red", value: "Red" },
                            { name: "Cyan", value: "Cyan" },
                            { name: "Blue", value: "Blue" },
                            { name: "Yellow", value: "Yellow" },
                            { name: "Magenta", value: "Magenta" }
                        )
                        .setRequired(true)
                )
        ),
    async execute(interaction, profileData) {
        const { balance, userId } = profileData;
        const shopCommand = interaction.options.getSubcommand();

        if (shopCommand === "custom-role") {
            const name = interaction.options.getString("name");
            const color = interaction.options.getString("color");

            if (balance < customRoleCost) {
                return await interaction.reply({ ephemeral: true, content: `You need ${customRoleCost} coins to buy a custom role` })
            }

            await interaction.deferReply();

            const customRole = await interaction.guild.roles.create({
                name,
                permissions: [],
                color,
            });

            interaction.member.roles.add(customRole);

            await profileModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $inc: {
                        balance: -customRoleCost,
                    },
                }
            );

            await interaction.editReply("Successfully purchased a custom role!");
        }
    }
};