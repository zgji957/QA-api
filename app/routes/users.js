const Router = require('koa-router');
const {find,findById,create,update,delete:del} = require('../controllers/users');

const router = new Router({prefix:'/users'});

router.get('/',find)

router.post('/',create)

router.get('/:id',findById)

router.put('/update',update)

router.delete('/delete',del)

module.exports = router;