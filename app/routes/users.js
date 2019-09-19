const Router = require('koa-router');
const {find,findById,create,update,delete:del,login,checkOwner,checkUserExist,listFollowing,follow,unfollow,listFollowers} = require('../controllers/users');
const { secret } = require('../config');
const jsonwebtoken = require('jsonwebtoken'); 
const jwt = require('koa-jwt');

const router = new Router({prefix:'/users'});

// 自己实现认证
// const auth = async(ctx,next)=>{
//     const {authorization=''}=ctx.request.header;
//     const token = authorization.replace('Bearer ','');
//     try{
//         const user = jsonwebtoken.verify(token,secret);
//         ctx.state.user = user;
//     }catch(err){
//         ctx.throw(401,err.message)
//     }
//     await next();
// }

// 使用koa-jwt实现认证
const auth = jwt({secret})

router.get('/',find)

router.post('/',create)
   
router.get('/:id',findById)

router.patch('/:id',auth,checkOwner,update)

router.delete('/:id',auth,checkOwner,del)

router.post('/login',login)

router.get('/getFollowing/:id',listFollowing)

router.put('/following/:id',auth,checkUserExist,follow)

router.put('/unfollowing/:id',auth,checkUserExist,unfollow)

router.get('/getFollowers/:id',listFollowers)

module.exports = router;