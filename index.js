const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();
const userRouter = new Router({prefix:'/users'})

router.get('/',(ctx)=>{
    ctx.body='首页';
})

userRouter.get('/',(ctx)=>{
    // ctx.set('Allow','GET, POST')
    ctx.body='获取用户列表';
})

userRouter.post('/',(ctx)=>{
    ctx.body={
        name:'gzf' 
    };
})

userRouter.get('/:id',(ctx)=>{
     ctx.body=`获取用户${ctx.params.id}`
})

app.use(bodyparser())
app.use(router.routes())
app.use(userRouter.routes())
app.use(userRouter.allowedMethods())

app.listen(8080)
