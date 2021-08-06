import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) throw new Error('No token for bot!');

const bot = new Telegraf(BOT_TOKEN);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
