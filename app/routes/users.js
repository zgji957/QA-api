const Router = require('koa-router');

const router = new Router({prefix:'/users'})

router.get('/',(ctx)=>{
    // ctx.set('Allow','GET, POST')
    ctx.body='获取用户列表';
})

router.post('/',(ctx)=>{
    ctx.body={
        name:'gzf' 
    };
})

router.get('/:id',(ctx)=>{
     ctx.body=`获取用户${ctx.params.id}`
})

module.exports = router;