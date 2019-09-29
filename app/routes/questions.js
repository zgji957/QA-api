const Router = require('koa-router');
const {find,findById,create,update,delete:deleteQuestion,checkQuestionExist,checkQuestioner} = require('../controllers/questions');
const { secret } = require('../config');
const jwt = require('koa-jwt');

const router = new Router({prefix:'/questions'});

// 使用koa-jwt实现认证
const auth = jwt({secret})

router.get('/',find)

router.post('/',auth,create)
   
router.get('/:id',findById)

router.patch('/:id',auth,checkQuestionExist,checkQuestioner,update)

router.delete('/:id',auth,checkQuestionExist,checkQuestioner,deleteQuestion)


module.exports = router;