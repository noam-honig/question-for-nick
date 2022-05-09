import * as jwt from 'jsonwebtoken';
import { BackendMethod } from 'remult';

export class AuthController {
    @BackendMethod({ allowed: true })
    static async signIn(username: string) {
        const validUsers = [
            { id: "1", name: "Jane", roles: [] },
            { id: "2", name: "Steve", roles: [] }
        ];
        const user = validUsers.find(user => user.name === username);
        if (!user)
            throw new Error("Invalid User");
        return jwt.sign(user, process.env.NODE_ENV === "production" ? 
           process.env.TOKEN_SIGN_KEY!:
           "my secret key");
    }
}