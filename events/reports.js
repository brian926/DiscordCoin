const { Events, EmbedBuilder } = require("discord.js");
const { REPORT_CHANNEL_ID: reportChannel } = process.env;

// On report, send the report to the channel given below
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === "bugreport") {
            const command = interaction.fields.getTextInputValue("command");
            const description = interaction.fields.getTextInputValue("description");

            const id = interaction.user.id;
            const member = interaction.member;
            const server = interaction.guild.id || "No server provided";

            const channel = await interaction.client.channels.cache.get(reportChannel);

            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setTitle(`Report from ${member}`)
                .addFields({ name: "User ID", value: `${id}` })
                .addFields({ name: "Member", value: `${member}` })
                .addFields({ name: "Server ID", value: `${server}` })
                .addFields({ name: "Command Reported", value: `${command}` })
                .addFields({ name: "Reported Description", value: `${description}` })
                .setTimestamp()
                .setFooter({ text: "Report Bug System" });

            await channel.send({ embeds: [embed] }).catch(err => console.log(`--> Error sending bug report: ${err}`))
            await interaction.reply("Your report has been submitted");
        }
    },
};