/**
 * • `sass me <word 1> <word 2> <word 3>` Get some sass
 * • `sass me <phrase 1> / <phrase 2> / <phrase 3>` Get some sass
 */

module.exports = controller => {
  const sassMe = (one, two, three) => {
    return `
\`\`\`
(•_•)
<) )╯   ${one}
 / \\

 (•_•)
 \\( (>   ${two}
  / \\

(•_•)
<) )╯   ${three}
 / \\
\`\`\`
`;
  };

  const regBothGrouped = /^sass me (((.+)\s\/\s(.+)\s\/\s(.+))\s?|(([^/]\S+)\s([^/]\S+)\s([^/]\S+))\s?)$/i;

  controller.hears(
    [regBothGrouped],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const [one, two, three] = message.match.filter(i => i).slice(3);
      if (!one || !two || !three) {
        bot.reply(message, "Missing at least one thing.");
      }
      bot.reply(message, sassMe(one, two, three));
    }
  );
};
