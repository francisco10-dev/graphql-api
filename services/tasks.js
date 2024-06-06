import { connection } from "./connection.js";
import { generatedId } from "../utils/id-generator.js";
import { sendNotification } from "../subscription.js";

const taskTable = ()=> connection.table('tasks');

export async function getTask(id){
    return await taskTable().first().where({id});
}

export async function getTasks(limit){
    const query=taskTable().select().orderBy('deadline','desc');
    if(limit){
        query.limit(limit);
    }
    return query;
}

export async function getTasksByUserId(user_id){
    return await taskTable().select().where({user_id});
}

export async function createTask({name, deadline, capture, user_id}){
    const task = {
        id: generatedId(),
        name,
        deadline,
        capture,
        user_id,
        created_at: new Date().toISOString()
    };
    await taskTable().insert(task);
    sendNotification(task);

    return task;
}

export async function updateTask({id, name, deadline, capture}){
    const task = await taskTable().first().where({id});
    if(!task){
        return null;
    }
    const updatedFields = {
        name, deadline, capture
    };
    await taskTable().update(updatedFields).where({id});

    return {...task, ...updatedFields};
}

export async function deleteTask(id){

    const task = taskTable().first().where({id});
    console.log('tasks.js(deleteTaks) retorna', task);


    if(!task){
        return null;
    }

    await taskTable().delete().where({id});
    return task;
}


