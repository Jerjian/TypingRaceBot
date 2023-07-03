const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("typeracer")
    .setDescription(
      "Challenge your friends in a race to see who can type the fastest!"
    )
    .addStringOption((option) =>
      option
        .setName("number-of-words")
        .setDescription("Number of words you wish to type")
        .setRequired(true)
    ),

  async execute(interaction) {
    let someoneWon = false;

    const nbrOfWords = parseInt(
      interaction.options.getString("number-of-words")
    );
    await interaction.reply(
      `We're about to start a Type Racer game! First one to type the ${nbrOfWords} ${
        nbrOfWords > 1 ? "words" : "word"
      } wins!`
    );
    await interaction.followUp("Starting in 3...");
    await timer(1000);
    await interaction.followUp("Starting in 2...");
    await timer(1000);
    await interaction.followUp("Starting in 1...");
    await timer(1000);
    const words = await generateWords(nbrOfWords);
    const sentence = words.join(" ");
    await interaction.followUp(`\`${sentence}\``);

    const filter = (m) => {
      console.log(m.content);
      return m.content === sentence;
    };

    const collector = interaction.channel.createMessageCollector({
      filter,
      time: nbrOfWords * 2000,
    });
    collector.on("collect", (m) => {
      interaction.followUp(`${m.author} won!`);
      someoneWon = true;
      collector.stop();
    });
    collector.on("end", () => {
      if (!someoneWon) {
        interaction.followUp("Time's up. No one won :(");
      }
    });
  },
};

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const generateWords = async (nbrOfWords) => {
  const { generate, count } = await import("random-words");
  const words = generate(nbrOfWords);
  return words;
};
