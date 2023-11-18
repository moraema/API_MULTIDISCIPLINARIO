/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE TABLE clientes (
      id_cliente int NOT NULL AUTO_INCREMENT,
      nombre varchar(45) NOT NULL,
      apellido varchar(45) NOT NULL,
      correo varchar(45) NOT NULL,
      contraseña varchar(245) NOT NULL,
      ubicacion varchar(45) NOT NULL,
      telefono varchar(45) NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id_cliente)
    ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(`
      DROP TABLE categorias;
    `);
};