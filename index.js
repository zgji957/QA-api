var Koa = require('koa');

var app = new Koa();

app.use((ctx,next)=>{
    ctx.body='test2'
})

app.use(()=>{
    console.log('next')
})

app.listen(8082)
