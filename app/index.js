const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const routing = require('./routes');
const error = require('koa-json-error');

const app = new Koa();

app.use(error({
    postFormat:(e,{stack,...rest})=>{
        return process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
    }
}))

app.use(bodyparser())

routing(app)

app.listen(8080)
