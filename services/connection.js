import knex from "knex";

export const connection = knex({
    client: 'better-sqlite3',
    connection: {
        filename: './database/db.sqlite3'
    },
    useNullAsDefault: true,
});
connection.on('query', ({sql, bindings}) => {
    const query = connection.raw(sql, bindings).toQuery();
    console.log('[DB] - - >', query)
});



