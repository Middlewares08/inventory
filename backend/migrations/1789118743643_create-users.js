/* eslint-disable camelcase */

const bcrypt = require('bcryptjs');

const DEFAULT_ADMIN_EMAIL = 'admin@example.com';
const DEFAULT_ADMIN_PASSWORD = 'ChangeMe123!';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    name: { type: 'varchar(120)' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  // Seed a default admin so the login page has something to authenticate against.
  // Change this password immediately in any real deployment.
  const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
  pgm.sql(
    `INSERT INTO users (email, password_hash, name) VALUES ('${DEFAULT_ADMIN_EMAIL}', '${passwordHash}', 'Admin')`
  );
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
