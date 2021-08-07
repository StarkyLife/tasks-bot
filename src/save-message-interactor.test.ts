import { Message } from './message';
import { MessagesGateway } from './messages-gateway';
import { createSaveMessageInteractor, SaveMessageInteractorDeps, SaveMessageRequest } from './save-message-interactor';

const AUTHORIZED_USER = 'authorized';

function createDeps(partialDeps?: Partial<SaveMessageInteractorDeps>): SaveMessageInteractorDeps {
    return {
        gateKeeper: partialDeps?.gateKeeper || {
            checkIfAuthorizedUser: jest.fn((userId) => userId === AUTHORIZED_USER),
        },
        parser: partialDeps?.parser || jest.fn(),
        messagesGateway: partialDeps?.messagesGateway || {
            save: jest.fn(),
        },
    };
}

it('should reject if not authorized user', async () => {
    const saveMessage = createSaveMessageInteractor(createDeps());

    const requestModel: SaveMessageRequest = {
        userId: 'not_authorized',
    };

    await expect(saveMessage(requestModel))
        .rejects
        .toEqual(new Error('not authorized'));
});

it.each([
    undefined,
    'unknown',
])('should resolve with null if message has unknown format: %s', async (message) => {
    const saveMessage = createSaveMessageInteractor(createDeps({
        parser: jest.fn(() => null),
    }));

    const requestModel: SaveMessageRequest = {
        userId: AUTHORIZED_USER,
        message,
    };

    await expect(saveMessage(requestModel))
        .resolves
        .toBeNull();
});

it('should save parsed message entity', async () => {
    const MESSAGE: Message = {
        text: 'parsable',
        type: 'task_plan',
    };

    const messagesGateway: MessagesGateway = {
        save: jest.fn(),
    };

    const saveMessage = createSaveMessageInteractor(createDeps({
        parser: jest.fn(() => MESSAGE),
        messagesGateway,
    }));

    const requestModel: SaveMessageRequest = {
        userId: AUTHORIZED_USER,
        message: MESSAGE.text,
    };

    await expect(saveMessage(requestModel))
        .resolves
        .toBeNull();

    expect(messagesGateway.save).toHaveBeenCalledWith(MESSAGE);
});
