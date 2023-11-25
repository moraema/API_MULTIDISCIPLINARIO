/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE TABLE administradores (
      id_administrador int NOT NULL AUTO_INCREMENT,
      usuario varchar(45) NOT NULL,
      contraseña varchar(245) NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      deleted_at timestamp NULL DEFAULT NULL,
      deleted tinyint(1) DEFAULT '0',
      created_by int DEFAULT NULL,
      updated_by int DEFAULT NULL,
      deleted_by int DEFAULT NULL,
      PRIMARY KEY (id_administrador)
    ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(`
    DROP TABLE administradores;
  `);
};