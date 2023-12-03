module.exports = {
    development: {
        client: 'mysql2',
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'contraseña',
            database: 'bd'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './migrations'
        },
        useNullAsDefault: true
    }
};