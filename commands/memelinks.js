const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reddit-memes")
        .setDescription("Post a reddit link to display a meme")
        .addStringOption((option) =>
            option
                .setName("link")
                .setDescription("Reddit link to a meme")
                .setRequired(true)
        ),
    async execute(interaction) {
        const link = interaction.options.getString("link");

        async function meme() {
            try {
                await fetch(`${link}/.json`)
                    .then(async r => {
                        let meme = await r.json();

                        let data = meme[0].data.children[0].data

                        let title = data.title;
                        let author = data.author;
                        let isVideo = data.is_video;

                        if (isVideo == true) {
                            console.log("--> Failed to send reddit post due to 'is_video == true'")
                            return await interaction.reply({ ephemeral: true, content: "This post is a video and I can't display it, sorry..." });
                        }

                        let image = data.url;

                        const embed = new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${title}`)
                            .setImage(`${image}`)
                            .setURL(`${image}`)
                            .setFooter({ text: author });

                        await interaction.reply({ embeds: [embed] });
                    })
            } catch (err) {
                console.log(`--> Error when retrieving memes: ${err}`);
            }
        }

        meme();
    },
};