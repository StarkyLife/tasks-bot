import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) throw new Error('No token for bot!');

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Hi');

    setTimeout(() => {
        bot.telegram.sendMessage(ctx.chat.id, 'Ooops! It is a reminder :)');
    }, 10000);
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
