import { GateKeeper } from './gate-keeper';
import { MessagesGateway } from './messages-gateway';
import { Parser } from './parser';

export type SaveMessageRequest = {
    userId: string;
    message?: string;
};

export type SaveMessageInteractorDeps = {
    gateKeeper: GateKeeper;
    parser: Parser;
    messagesGateway: MessagesGateway;
};

export function createSaveMessageInteractor(deps: SaveMessageInteractorDeps) {
    return async ({ userId, message }: SaveMessageRequest) => {
        if (!deps.gateKeeper.checkIfAuthorizedUser(userId)) {
            throw new Error('not authorized');
        }

        if (message) {
            const parsedMessage = deps.parser(message);

            if (parsedMessage) {
                await deps.messagesGateway.save(parsedMessage);
            }
        }

        return null;
    };
}
