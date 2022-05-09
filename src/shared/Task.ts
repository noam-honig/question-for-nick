import { Allow, Entity, Fields, Validators } from "remult";

@Entity<Task>("tasks", {
   allowApiCrud:true,
    saving: task => {
        task.lastUpdated = new Date()
    }
})
export class Task {
    @Fields.uuid()
    id?: string;
    @Fields.string<Task>({
        validate: task => {
            if (task.title.length < 3)
                throw "too short";
        }
    })
    title = '';
    @Fields.boolean()
    completed = false;
    @Fields.date({
        allowApiUpdate: false
    })
    lastUpdated = new Date();
}