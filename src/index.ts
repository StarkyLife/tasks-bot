import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { HardcodedGateKeeper } from './hardcoded-gate-keeper';
import { InMemoryMessagesGateway } from './in-memory-messages-gateway';
import { createSaveMessageInteractor } from './save-message-interactor';
import { parseTasks } from './tasks-parser';

dotenv.config();

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) throw new Error('No token for bot!');

const messagesGateway = new InMemoryMessagesGateway();

const saveMessageInteractor = createSaveMessageInteractor({
    gateKeeper: HardcodedGateKeeper,
    messagesGateway,
    parser: parseTasks,

});

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Hi');

    // setTimeout(() => {
    //     bot.telegram.sendMessage(ctx.chat.id, 'Ooops! It is a reminder :)');
    // }, 10000);
});

bot.command('list', (ctx) => {
    ctx.reply(JSON.stringify(messagesGateway.messages));
});

bot.on('text', async (ctx) => {
    try {
        const isSaved = await saveMessageInteractor({
            userId: ctx.from.username || '',
            message: ctx.message.text,
        });

        if (isSaved) {
            ctx.reply('Сохранил');
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e.stack);
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
