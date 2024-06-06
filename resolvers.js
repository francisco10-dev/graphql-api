import { GraphQLError, subscribe } from "graphql";
import { getTask, getTasks, createTask, updateTask, deleteTask, getTasksByUserId } from './services/tasks.js';
import { getUser, getUsers, createUser, updateUser, deleteUser  } from "./services/user.js";
import { PubSub } from "graphql-subscriptions";

const errorMessage = new GraphQLError("Usuario no autenticado", {extensions: {code: 'UNAUTHORIZED'}});
const notFoundMessage = new GraphQLError("Registro no existe", {extensions: {code: 'NOT_FOUND',}});
const pubSub = new PubSub();

export const resolvers ={
    Query: {
        user:(_root, {id}) => {
            const user = getUser(id);
            if(!user){
                return notFoundMessage;
            }
            return user;
        },
        users: async (_root, {limit}) => {
            const users = await getUsers(limit);
            return { items: users || [] }
        },
        task: async (_root, {id}) => {
            const task = await getTask(id);
            if(!task){
                return notFoundMessage;
            }
            return task;
        },
        tasks: async (_root, {limit}) => {
            const tasks = await getTasks(limit);
            return {items: tasks || []};
        }
    }, 
    Task: {
        user: async (task) => {
            return await getUser(task.user_id);
        },
        created_at: (task) => {
            return task.created_at.slice(0,'yyyy-mm-dd'.length);
        }
    },
    User: {
        tasks: async(user) => {
            return await getTasksByUserId(user.id);
        }
    },
    Mutation: {
        createTask: async (_root, {input: {name, deadline, capture}}, {auth}) => {
            if(!auth){
                return errorMessage;
            }
            const task = await createTask({name, deadline, capture, user_id: auth.sub});
            pubSub.publish('TASK_ADDED', {newTask: task});
            return task;
        }, 
        updateTask: (_root, {input: {id, name, deadline, capture}}, {auth}) => {
            if(!auth){
                return errorMessage;
            }
            const task = updateTask({id, name, deadline, capture});
            if(!task){
                return notFoundMessage;
            }
            return task;
        },
        deleteTask: async (_root, {id}, {auth}) => {
            if(!auth){
                return errorMessage;
            }
            const task = await deleteTask(id);
            if(!task){
                return notFoundMessage;
            }
            return task;
        },
        createUser: async (_root, {input: {name, last_name, email, password}}, {auth} ) => {
            if(!auth){
                return errorMessage;
            }
            const user = await createUser({name, last_name, email, password});
            pubSub.publish('USER_ADDED', {newUser: user});
            return user;
        },
        updateUser: async (_root, {input: {id, name, last_name, email, password}}, {auth}) => {
            if(!auth){
                return errorMessage;
            }
            const user = await updateUser({id, name, last_name, email, password});
            if(!user){
                return notFoundMessage;
            }
            return user;
        },
        deleteUser: async (_root, {id}, {auth}) => {
            if(!auth){
                return errorMessage;
            }
            const user = await deleteUser(id);
            console.log(user);
            if (!user) {
                return notFoundMessage;
            }
            return user;
        }
    },
    Subscription:{
        newTask: {
            subscribe:(_, args, {user})=> {
                return pubSub.asyncIterator('TASK_ADDED');
            },
        },
        newUser: {
            subscribe: (_, args, {user})=> {
                return pubSub.asyncIterator('USER_ADDED');
            },
        }
    },

}