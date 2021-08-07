export interface GateKeeper {
    checkIfAuthorizedUser(userId: string): boolean;
}
