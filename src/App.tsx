import { useEffect, useState } from "react";
import { ErrorInfo } from "remult";
import { remult, setAuthToken } from "./common";
import { AuthController } from "./shared/AuthController";
import { Task } from "./shared/Task";
import { TasksController } from "./shared/TasksController";

const taskRepo = remult.repo(Task);
async function fetchTasks() {
  if (!taskRepo.metadata.apiReadAllowed)
    return [];
  return taskRepo.find({
    orderBy: {
      completed: "asc",

    },
    where: { completed: undefined }
  });
}

function App() {
  const [tasks, setTasks] = useState<(Task & { error?: ErrorInfo<Task> })[]>([]);
  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  const addTask = () => setTasks([...tasks, new Task()]);

  const setAll = async (completed: boolean) => {
    await TasksController.setAll(completed);
    fetchTasks().then(setTasks);
  }

  const [username, setUsername] = useState("");
  const signIn = async () => {
    setAuthToken(await AuthController.signIn(username));
    fetchTasks().then(setTasks);
  }
  const signOut = () => {
    setAuthToken(null);
    setTasks([]);
  }
  if (!remult.authenticated())
    return (<div>
      <p>
        <input value={username} onChange={e => setUsername(e.target.value)} />
        <button onClick={signIn}>Sign in</button> <span style={{ color: 'green' }}></span>
      </p>
    </div>);

  return (
    <div>
      <p>
        Hi {remult.user.name} <button onClick={signOut}>Sign out </button>
      </p>
      {tasks.map(task => {
        const handleChange = (values: Partial<Task>) => {
          setTasks(tasks.map(t => t === task ? { ...task, ...values } : t));
        }
        const saveTask = async () => {
          try {
            const updatedTask = await taskRepo.save(task);
            setTasks(tasks.map(t => t === task ? updatedTask : t));
          }
          catch (error: any) {
            setTasks(tasks.map(t => t === task ? { ...task, error } : t));
            alert(error.message);
          }
        }

        const deleteTask = async () => {
          await taskRepo.delete(task);
          setTasks(tasks.filter(t => t !== task));
        }

        return <div key={task.id}>
          <input type="checkbox"
            onChange={e => handleChange({ completed: e.target.checked })}
            checked={task.completed} />
          <input value={task.title}
            onChange={e => handleChange({ title: e.target.value })} />
          <span>{task.error?.modelState?.title}</span>
          <button onClick={saveTask}>Save</button>
          <button onClick={deleteTask}>Delete</button>
        </div>
      })}
      <button onClick={addTask}>Add</button>
      <div>
        <button onClick={() => setAll(true)}>set all completed</button>
        <button onClick={() => setAll(false)}>set all uncompleted</button>
      </div>
    </div>
  );
}

export default App;
