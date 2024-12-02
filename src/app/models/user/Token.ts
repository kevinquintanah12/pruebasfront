export class Token {
    id: string;
    user: string;
    token: string;

    constructor(id: string = "defaultId", user: string = "defaultUser", token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtldmluZW1tYW51ZWwiLCJleHAiOjE3MzMxMTY1ODIsIm9yaWdJYXQiOjE3MzMxMTYyODJ9.kxG8Vc2hA06kVQVNcwLss-hRwmyp1QCuKM2i69qUhpA") {
        this.id = id;
        this.user = user;
        this.token = token;
    }
}
