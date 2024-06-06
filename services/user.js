import { connection } from "./connection.js";
import { generatedId } from "../utils/id-generator.js";

const userTable = ()=> connection.table('users');
const taskTable = ()=> connection.table('tasks');


export async function getUserByEmail(email){
    return await userTable().first().where({email});
}

export async function getUsers(limit){
    const query = userTable().select();
    if(limit){
        query.limit(limit);
    }
    const users = await query;
    
   /*for (let user of users) {
        const userTasks = await taskTable().where({ user_id: user.id }); 
        user.tasks = userTasks || [];
    }*/
    return users;
}

export async function createUser({name, last_name, email, password}){
    const user = {
        id: generatedId(),
        name,
        last_name,
        email,
        password,
        created_at: new Date().toISOString()
    };
    await userTable().insert(user);
    return user;
}

export async function updateUser({id, name, last_name, email, password}){
    const user = await userTable().first().where({id});
    if(!user){
        return null;
    }
    const updatedFields = {
        name, last_name, email, password
    };
    await userTable().update(updatedFields).where({id});

    return {...user, ...updatedFields};
}

export async function deleteUser(id) {
    const user = await userTable().first().where({ id });

    if (!user) {
        return null;
    }

    await userTable().delete().where({ id });
    console.log('user.js(deleteUser) retorna', user);

    return user;
}


export async function getUser(id){
    return await userTable().first().where({id});
}