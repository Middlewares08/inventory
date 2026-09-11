/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'varchar(120)', notNull: true, unique: true },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('items', {
    id: 'id',
    sku: { type: 'varchar(64)', notNull: true, unique: true },
    name: { type: 'varchar(200)', notNull: true },
    category_id: {
      type: 'integer',
      references: 'categories',
      onDelete: 'SET NULL',
    },
    quantity: { type: 'integer', notNull: true, default: 0 },
    unit: { type: 'varchar(32)' },
    location: { type: 'varchar(120)' },
    reorder_level: { type: 'integer', notNull: true, default: 0 },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('items', 'category_id');

  // Tracks every stock change so movements can be monitored over time.
  pgm.createTable('stock_movements', {
    id: 'id',
    item_id: {
      type: 'integer',
      notNull: true,
      references: 'items',
      onDelete: 'CASCADE',
    },
    change: { type: 'integer', notNull: true },
    reason: { type: 'varchar(200)' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createIndex('stock_movements', 'item_id');
};

exports.down = (pgm) => {
  pgm.dropTable('stock_movements');
  pgm.dropTable('items');
  pgm.dropTable('categories');
};
