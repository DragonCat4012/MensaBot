const { Telegraf } = require('telegraf');
const getJSON = require('bent')('string');
const config = require('../config.json');

const bot = new Telegraf(config.telegramToken);
bot.start()
console.log("online")
bot.launch();

bot.command('meal', async (ctx) => {
    if (ctx.message.from.is_bot) return;
    await ctx.replyWithMarkdownV2(await getMealToday())
});
bot.hears('meal', async (ctx) => {
    if (ctx.message.from.is_bot) return;
    await ctx.replyWithMarkdownV2(await getMealToday())
});

async function getMealToday() {
    let date = new Date();
    let day = date.getDate();
    if (date.getDay() == 0) day = date.getDate() + 1;
    if (date.getDay() == 6) day = date.getDate() + 2;
    let month = date.getMonth() + 1;

    let serachedDate = `${date.getFullYear()}-${
        month.length == 1 ? '0' + month : month
    }-${day}`;

    let res = await getJSON(  `https://openmensa.org/api/v2/canteens/${config.canteenId}/days/${serachedDate}/meals` );
    let parsed = JSON.parse(res);

    let mealList = [];
    for (m of parsed) {
        if (m.notes.includes('vegetarisch')) m.name = '💚' + m.name;
        m.name = m.name.replace(/\(.*?\)/g, '');
        let arr = m.name.split(';');
        mealList.push(`${arr[0]} \n`);
    }
    console.log(mealList.join(" "))
    return  `* Essen * ${serachedDate.replace(/-/g, " ")} \n\`• ` +  mealList.join('\n• ') +  '`';
}