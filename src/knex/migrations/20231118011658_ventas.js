/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE TABLE ventas (
      id_venta int NOT NULL AUTO_INCREMENT,
      subtotal int NOT NULL,
      total int NOT NULL,
      id_cliente int NOT NULL,
      id_metodo_pago int NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id_venta),
      KEY fk_ventas_clientes (id_cliente),
      KEY fk_ventas_metodos_pago (id_metodo_pago),
      CONSTRAINT fk_ventas_clientes FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente),
      CONSTRAINT fk_ventas_metodos_pago FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pagos (id_metodo_pago)
    ) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb3
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