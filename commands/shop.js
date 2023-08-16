const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");
const { customRoleCost, custonRoleEdit } = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shop for your coins")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-role")
                .setDescription(`Buy or edit a custom role`)
                .addStringOption((option) =>
                    option
                        .setName("action")
                        .setDescription("Choose to edit or buy a custom role")
                        .addChoices(
                            {
                                name: `Buy a Role for ${customRoleCost} coins`,
                                value: "buy"
                            },
                            {
                                name: `Edit Role for ${custonRoleEdit} coins`,
                                value: "edit"
                            }
                        )
                        .setRequired(true)
                )
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
                            { name: "Greyple", value: "Greyple" },
                            { name: "Blurple", value: "Blurple" },
                            { name: "Yellow", value: "Yellow" },
                            { name: "Green", value: "Green" }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-role-removal")
                .setDescription("Delete your custom role")
        ),
    async execute(interaction, profileData) {
        const { balance, userId, customRoleId } = profileData;
        const shopCommand = interaction.options.getSubcommand();

        if (shopCommand === "custom-role") {
            const action = interaction.options.getString("action");
            const name = interaction.options.getString("name");
            const color = interaction.options.getString("color");

            if (action === "buy") {
                if (customRoleId !== "") {
                    return await interaction.reply({ ephemeral: true, content: `You already have a custom role!` })
                }
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
                        $set: {
                            customRoleId: customRole.id,
                        },
                        $inc: {
                            balance: -customRoleCost,
                        },
                    }
                );
                await interaction.editReply("Successfully purchased a custom role!");
            }
            else if (action === "edit") {
                if (customRoleId === "") {
                    return await interaction.reply({ ephemeral: true, content: `You need to have a custom role!` })
                }
                if (balance < customRoleCost) {
                    return await interaction.reply({ ephemeral: true, content: `You need ${customRoleCost} coins to buy a custom role` })
                }

                await interaction.deferReply();

                const editRole = await interaction.guild.roles.fetch(customRoleId);

                editRole.edit({ name, color });

                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            balance: -custonRoleEdit,
                        },
                    }
                );
                await interaction.editReply("Successfully edit your custom role!");
            }
        } else if (shopCommand === "custom-role-removal") {
            if (customRoleId === "") {
                return await interaction.reply({ ephemeral: true, content: `You need to have a custom role!` })
            }

            await interaction.deferReply({ ephemeral: true });

            const customRole = await interaction.guild.roles.fetch(customRoleId);

            customRole.delete();

            await profileModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $set: {
                        customRoleId: "",
                    },
                }
            );

            await interaction.editReply("Successfully removed your custom role!");
        }
    }
};