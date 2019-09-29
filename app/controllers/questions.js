const Question = require('../models/questions');
const User = require('../models/users');

class QuestionsCtl {
    async find(ctx){
        const {per_page=10}=ctx.query;
        const page = Math.max(ctx.query.page*1,1)-1;
        const perPage = Math.max(per_page*1,1);
        const q = new RegExp(ctx.query.q);
        ctx.body=await Question.find({
            $or:[{title:q},{description:q}]
        }).limit(perPage).skip(page*perPage);
    }
    async findById(ctx){
        const {fields=''}=ctx.query;
        const selectFields=fields.split(';').filter(i=>i).map(i=>' +'+i).join('');
        const question = await Question.findById(ctx.params.id).select(selectFields);
        ctx.body = question;
    }
    async create(ctx){
        ctx.verifyParams({
            title:{
                type:'string',
                required:true
            },
            description:{
                type:'string',
                required:false
            }
        })
        const question = await new Question({...ctx.request.body,questioner:ctx.state.user._id}).save();
        ctx.body = question;
    }
    async update(ctx){
        ctx.verifyParams({
            name:{
                type:'string',
                required:false
            },
            avatar_url:{
                type:'string',
                required:false
            },
            introduction:{
                type:'string',
                required:false
            }
        })
        await ctx.state.question.update(ctx.request.body);
        ctx.body = ctx.state.question;
    }
    async delete(ctx){ 
        const questionUser = await Question.findByIdAndRemove(ctx.params.id);
        if(!questionUser){ctx.throw(404,'问题不存在')}
        ctx.status = 204;
    }
    async checkQuestionExist(ctx,next){
        const question = await Question.findById(ctx.params.id);
        if(!question){ctx.throw(404,'问题不存在')}
        ctx.state.question = question;
        await next();
    }
    async checkQuestioner(ctx,next){
        const {question} = ctx.state;
        console.log('4234',ctx.state)
        if(question.questioner.toString()!==ctx.state.user._id){
            ctx.throw(403,'没有权限')
        }
        await next();
    }
}

module.exports = new QuestionsCtl();