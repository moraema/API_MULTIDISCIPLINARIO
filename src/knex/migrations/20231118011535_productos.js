/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE TABLE productos (
      id_producto int NOT NULL,
      nombre_producto varchar(45) NOT NULL,
      precio decimal(10,2) NOT NULL,
      descripcion longtext NOT NULL,
      imagen longtext NOT NULL,
      id_categoria int NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      deleted_at timestamp NULL DEFAULT NULL,
      deleted tinyint(1) DEFAULT '0',
      created_by int DEFAULT NULL,
      updated_by int DEFAULT NULL,
      deleted_by int DEFAULT NULL,
      PRIMARY KEY (id_producto, id_categoria),
      KEY fk_productos_categorias1_idx (id_categoria),
      CONSTRAINT fk_productos_categorias1 FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(`
      DROP TABLE productos;
    `);
};