const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const routing = require('./routes');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const { connectionStr } = require('./config');

const app = new Koa();

mongoose.connect(connectionStr,{ useNewUrlParser: true },()=>{console.log('connect success')});
mongoose.connection.on('error',(error)=>{console.log(error)});

app.use(error({
    postFormat:(e,{stack,...rest})=>{
        return process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
    } 
}))

app.use(bodyparser()); 

app.use(parameter(app));

routing(app);

app.listen(8080);
