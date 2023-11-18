/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE TABLE ventas_productos (
      id_ventas_producto int NOT NULL AUTO_INCREMENT,
      cantidad int NOT NULL,
      total int NOT NULL,
      id_producto int NOT NULL,
      id_venta int NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id_ventas_producto,id_producto,id_venta),
      KEY fk_ventas_productos_productos1_idx (id_producto),
      KEY fk_ventas_productos_ventas1_idx (id_venta),
      CONSTRAINT fk_ventas_productos_productos1 FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
    ) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3
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