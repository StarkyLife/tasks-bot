import { GateKeeper } from './gate-keeper';

export const HardcodedGateKeeper: GateKeeper = {
    checkIfAuthorizedUser(userId) {
        return userId === 'StarkyLife';
    },
};
