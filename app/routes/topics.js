const Router = require('koa-router');
const {find,findById,create,update,delete:deleteTopic,listFollowers,checkTopicExist} = require('../controllers/topics');
const { secret } = require('../config');
const jwt = require('koa-jwt');

const router = new Router({prefix:'/topics'});

// 使用koa-jwt实现认证
const auth = jwt({secret})

router.get('/',find)

router.post('/',auth,create)
   
router.get('/:id',findById)

router.patch('/:id',auth,checkTopicExist,update)

router.delete('/:id',deleteTopic)

router.get('/getFollowers/:id',checkTopicExist, listFollowers)

module.exports = router;