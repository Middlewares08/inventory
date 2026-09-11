const { Router } = require('express');
const itemController = require('../controllers/itemController');

const router = Router();

router.get('/', itemController.listItems);
router.get('/:id', itemController.getItem);
router.post('/', itemController.createItem);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
