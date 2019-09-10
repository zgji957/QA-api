const Koa = require('koa');
const koaBody = require('koa-body');
const routing = require('./routes');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const { connectionStr } = require('./config');
const path = require('path');
const koaStatic = require('koa-static');

const app = new Koa();

mongoose.connect(connectionStr,{ useNewUrlParser: true },()=>{console.log('connect success')});
mongoose.connection.on('error',(error)=>{console.log(error)});

app.use(koaStatic(path.join(__dirname,'public')));

app.use(error({
    postFormat:(e,{stack,...rest})=>{
        return process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
    } 
})) 

app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'/public/uploads'),
        keepExtensions:true, 
    }
})); 

app.use(parameter(app));

routing(app);

app.listen(8080);
