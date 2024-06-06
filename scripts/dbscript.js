import  { connection } from '../services/connection.js';

const {schema} = connection;
await schema.dropTableIfExists('users');
await schema.dropTableIfExists('tasks');

await schema.createTable('users', (table) => {
    table.text('id').notNullable().primary();
    table.text('name').notNullable();
    table.text('last_name').nullable();
    table.text('email').notNullable().unique();
    table.text('password').notNullable();
    table.text('created_at').notNullable();
});

await schema.createTable('tasks', (table) => {
    table.text('id').notNullable().primary();
    table.text('name').notNullable();
    table.text('deadline').notNullable();
    table.text('capture').nullable();
    table.text('user_id').notNullable().references('id').inTable('users');
    table.text('created_at').notNullable();
});

await connection.table('users').insert([{
    id: 'aAsxeqserfsd',
    name: 'Francisco',
    last_name: 'Ortiz',
    email: 'francisco@una.cr',
    password: '1234',
    created_at: new Date().toISOString(),
}]);

process.exit();

