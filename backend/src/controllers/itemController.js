const db = require('../config/db');

async function listItems(req, res, next) {
  try {
    const { rows } = await db.query(
      `SELECT i.*, c.name AS category_name
       FROM items i
       LEFT JOIN categories c ON c.id = i.category_id
       ORDER BY i.id`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const { rows } = await db.query('SELECT * FROM items WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createItem(req, res, next) {
  try {
    const { sku, name, category_id, quantity = 0, unit, location, reorder_level = 0 } = req.body;
    const { rows } = await db.query(
      `INSERT INTO items (sku, name, category_id, quantity, unit, location, reorder_level)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [sku, name, category_id, quantity, unit, location, reorder_level]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateItem(req, res, next) {
  try {
    const { sku, name, category_id, quantity, unit, location, reorder_level } = req.body;
    const { rows } = await db.query(
      `UPDATE items SET
         sku = COALESCE($1, sku),
         name = COALESCE($2, name),
         category_id = COALESCE($3, category_id),
         quantity = COALESCE($4, quantity),
         unit = COALESCE($5, unit),
         location = COALESCE($6, location),
         reorder_level = COALESCE($7, reorder_level),
         updated_at = now()
       WHERE id = $8
       RETURNING *`,
      [sku, name, category_id, quantity, unit, location, reorder_level, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteItem(req, res, next) {
  try {
    const { rowCount } = await db.query('DELETE FROM items WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Item not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listItems, getItem, createItem, updateItem, deleteItem };
