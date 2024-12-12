export class Token {
    id: string;
    user: string;
    token: string;

    constructor(
        id: string = "defaultId",
        user: string = "defaultUser",
        token: string = "defaultToken"
    ) {
        this.id = id;
        this.user = user;
        this.token = token;
    }
}