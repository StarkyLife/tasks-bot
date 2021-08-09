import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { getConnectedGoogleInstance } from './google';
import { GoogleSheetMessagesGateway } from './google-sheet-messages-gateway';
import { HardcodedGateKeeper } from './hardcoded-gate-keeper';
import { createSaveMessageInteractor } from './save-message-interactor';
import { parseTasks } from './tasks-parser';

dotenv.config();

const { BOT_TOKEN, SHEET_ID } = process.env;

if (!BOT_TOKEN) throw new Error('No token for bot!');
if (!SHEET_ID) throw new Error('No sheet id');

const saveMessageInteractor = createSaveMessageInteractor({
    gateKeeper: HardcodedGateKeeper,
    messagesGateway: new GoogleSheetMessagesGateway(
        SHEET_ID,
        getConnectedGoogleInstance(),
    ),
    parser: parseTasks,

});

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('Hi');

    // setTimeout(() => {
    //     bot.telegram.sendMessage(ctx.chat.id, 'Ooops! It is a reminder :)');
    // }, 10000);
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
