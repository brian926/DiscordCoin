const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const levelModel = require("../models/levelSchema");

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
        const linkPass = interaction.options.getString("link").split("?");
        const link = linkPass[0]

        try {
            await fetch(`${link}/.json`)
                .then(async r => {
                    let meme = await r.json();

                    let data = meme[0].data.children[0].data

                    let title = data.title;
                    let author = data.author;
                    let postfix = data.permalink;
                    let isVideo = data.is_video;

                    if (isVideo == true) {
                        console.log("--> Failed to send reddit post due to 'is_video == true'")
                        return await interaction.reply({ ephemeral: true, content: "This post is a video and I can't display it, sorry... Try posting the link to display a video player" });
                    }

                    let image = data.url;
                    const give = 1;
                    let levelXp;

                    try {
                        levelXp = await levelModel.findOne({ userId: interaction.user.id });
                    } catch (err) {
                        console.log(err);
                    }

                    const requireXP = levelXp.level * levelXp.level
                    if (levelXp.xp + give >= requireXP) {
                        levelXp.xp += give;
                        levelXp.level += 1;

                        try {
                            await levelXp.save();
                        } catch (err) {
                            console.log(err)
                        }
                    } else {
                        levelXp.xp += give;

                        try {
                            await levelXp.save();
                        } catch (err) {
                            console.log(err)
                        }
                    }

                    const embed = new EmbedBuilder()
                        .setColor("Blurple")
                        .setTitle(`${title}`)
                        .setImage(`${image}`)
                        .setURL(`https://reddit.com${postfix}`)
                        .setFooter({ text: author });

                    await interaction.reply({ embeds: [embed] });
                })
        } catch (err) {
            console.log(`--> Error when retrieving memes: ${err}`);
            return await interaction.reply({ ephemeral: true, content: "There was an error with this link." });
        }
    },
};