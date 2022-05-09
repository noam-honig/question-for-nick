import express from 'express';
import { expressjwt } from 'express-jwt';
import { remultExpress } from 'remult/remult-express';
import { AuthController } from '../shared/AuthController';
import { Task } from '../shared/Task';
import { TasksController } from '../shared/TasksController';

let app = express();
app.use(expressjwt({
    secret: process.env.NODE_ENV === "production" ? process.env.TOKEN_SIGN_KEY! : "my secret key",
    credentialsRequired: false,
    algorithms: ['HS256']
}))
app.use(remultExpress({
    entities: [Task],
    controllers: [TasksController, AuthController],
    initApi: async remult => {
        const taskRepo = remult.repo(Task);
        if (await taskRepo.count() === 0) {
            await taskRepo.insert([
                { title: "Task a" },
                { title: "Task b" },
                { title: "Task c", completed: true },
                { title: "Task d" },
                { title: "Task e", completed: true },
            ])
        }
    }
}));

app.listen(3002, () => console.log("Server started"));