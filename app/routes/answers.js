const Router = require('koa-router');
const {find,findById,create,update,delete:deleteAnswer,checkAnswerExist,checkAnswerer} = require('../controllers/answers');
const { secret } = require('../config');
const jwt = require('koa-jwt');

const router = new Router({prefix:'/questions/:questionId/answers'});

// 使用koa-jwt实现认证
const auth = jwt({secret})

router.get('/',find)

router.post('/',auth,create)
   
router.get('/:id',findById)

router.patch('/:id',auth,checkAnswerExist,checkAnswerer,update)

router.delete('/:id',auth,checkAnswerExist,checkAnswerer,deleteAnswer)


module.exports = router;