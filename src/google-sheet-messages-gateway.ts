import { format } from 'date-fns';
import { GoogleInstance } from './google';
import { Message } from './message';
import { MessagesGateway } from './messages-gateway';

export class GoogleSheetMessagesGateway implements MessagesGateway {
    constructor(
        private sheetId: string,
        private googleInstance: GoogleInstance,
    ) {}

    async save(message: Message) {
        await this.googleInstance.appendDataToSpreadSheet(
            this.sheetId,
            'Sheet1',
            [
                [
                    format(new Date(), 'dd.MM.yyyy'),
                    message.text,
                ],
            ],
        );
    }
}
