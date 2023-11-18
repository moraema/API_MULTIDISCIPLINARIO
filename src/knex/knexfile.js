module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'contraseña',
            database: 'base-de-datos'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations'
        },
        useNullAsDefault: true
    }
};