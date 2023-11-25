/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.raw(`
    CREATE TABLE pedidos (
      id_pedido int NOT NULL AUTO_INCREMENT,
      pedido_fecha timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      total int NOT NULL,
      detalle_pedido longtext NOT NULL,
      id_cliente int NOT NULL,
      id_metodo_pago int NOT NULL,
      created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      deleted_at timestamp NULL DEFAULT NULL,
      deleted tinyint(1) DEFAULT '0',
      created_by int DEFAULT NULL,
      updated_by int DEFAULT NULL,
      deleted_by int DEFAULT NULL,
      PRIMARY KEY (id_pedido),
      KEY fk_pedidos_clientes1_idx (id_cliente),
      KEY fk_pedidos_metodo_pago1_idx (id_metodo_pago),
      CONSTRAINT fk_pedidos_clientes1 FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente),
      CONSTRAINT fk_pedidos_metodo_pago1 FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pagos (id_metodo_pago)
    ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.raw(`
      DROP TABLE pedidos;
    `);
};