const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const Question = require('../models/questions');
const Answer = require('../models/Answers');
const { secret } = require('../config');
class UsersCtl {
    async find(ctx){
        const {per_page=10}=ctx.query;
        const page = Math.max(ctx.query.page*1,1)-1;
        const perPage = Math.max(per_page*1,1);
        ctx.body=await User.find({
            name:new RegExp(ctx.query.q)
        }).limit(perPage).skip(page*perPage);
    }
    async findById(ctx){
        const {fields=''} = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(i=>' +'+i).join('');
        const populateStr = fields.split(';').filter(f=>f).map(i=>{
            if(i==='employments'){
                return 'employments.company employments.job';
            }else if(i==='educations'){
                return 'educations.school education.major';
            }
            return i;
        })
        const user = await User.findById(ctx.params.id)
                    .select(selectFields)
                    .populate(populateStr);
        if(!user){
            ctx.throw(404,"用户不存在")
        }
        ctx.body=user;
    }
    async create(ctx){
        ctx.verifyParams({
            name:{
                type:'string',
                required:true,
            },
            password:{
                type:'string',
                required:true,
            }
        })
        const {name} = ctx.request.body;
        const repeatUser = await User.findOne({name});
        if(repeatUser){ctx.throw(409,'用户已注册')}
        const user = await new User(ctx.request.body).save();
        ctx.body=user; 
    }
    async update(ctx){
        ctx.verifyParams({
            name:{
                type:'string',
                required:false,
            },
            password:{
                type:'string',
                required:false,
            },
            avatar_url:{
                type:'string',
                required:false,
            },
            gender:{
                type:'string',
                required:false,
            },
            headline:{
                type:'string',
                required:false,
            },
            locations:{
                type:'array',
                itemType:'string',
                required:false,
            },
            business:{
                type:'string',
                required:false,
            },
            employments:{
                type:'array',
                itemType:'object',
                required:false,
            },
            education:{
                type:'array',
                itemType:'object',
                required:false,
            }
        })
        const updateUser = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        ctx.body = updateUser;
    }
    async delete(ctx){ 
        const removeUser = await User.findByIdAndRemove(ctx.params.id);
        if(!removeUser){ctx.throw(404,'用户不存在')}
        ctx.status = 204;
    }
    async login(ctx){
        ctx.verifyParams({
            name:{
                type:'string',
                required:true,
            },
            password:{
                type:'string',
                required:true,
            }
        })
        const user = await User.findOne(ctx.request.body);
        if(!user){ctx.throw(401,'用户名或密码错误')}
        const {_id,name} = user;
        const token = jsonwebtoken.sign({_id,name},secret,
            // {expiresIn:'1d'}
        );
        ctx.body = {
            token,
        };
    }  
    async checkOwner(ctx,next){
        if(ctx.params.id!==ctx.state.user._id){
            ctx.throw(403,'没有权限')
        }
        await next();
    }
    async checkUserExist(ctx,next){
        const user = await User.findById(ctx.param.id);
        if(!user){ctx.throw(404,'用户不存在')}
        await next();
    }
    async listFollowers(ctx){
        const user = await User.find({following:ctx.params.id});
        ctx.body = user;
    }
    async listFollowing(ctx){
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body = user.following;
    }
    async follow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        if(!me.following.map(i =>i.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }
    async unfollow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(i=>i.toString()).indexOf(ctx.params.id);
        if(index>-1){
            me.following.splice(index,1);
            me.save();
        }
        ctx.status = 204;
    }
    async listFollowingTopics(ctx){
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');
        if(!user){ctx.throw(404,'话题不存在')}
        ctx.body = user.followingTopics;
    }
    async followTopic(ctx){
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        if(!me.followingTopics.map(i =>i.toString()).includes(ctx.params.id)){
            me.followingTopics.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }
    async unfollowTopic(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.followingTopics.map(i=>i.toString()).indexOf(ctx.params.id);
        if(index>-1){
            me.followingTopics.splice(index,1);
            me.save();
        }
        ctx.status = 204;
    }
    async listQuestions(ctx){
        const questions = await Question.find({questioner:ctx.params.id})
        ctx.body = questions;
    }
    async listLikingAnswers(ctx){
        const user = await User.findById(ctx.params.id).select('+likingAnswers').populate('likingAnswers');
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body = user.following;
    }
    async likeAnswer(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        if(!me.likingAnswers.map(i =>i.toString()).includes(ctx.params.id)){
            me.likingAnswers.push(ctx.params.id);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        }
        ctx.status = 204;
        await next();
    }
    async unlikeAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+likingAnswers');
        const index = me.likingAnswers.map(i=>i.toString()).indexOf(ctx.params.id);
        if(index>-1){
            me.likingAnswers.splice(index,1);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
        }
        ctx.status = 204;
    }
    async listDislikingAnswers(ctx){
        const user = await User.findById(ctx.params.id).select('+dislikingAnswers').populate('dislikingAnswers');
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body = user.following;
    }
    async dislikeAnswer(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        if(!me.dislikingAnswers.map(i =>i.toString()).includes(ctx.params.id)){
            me.dislikingAnswers.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
        await next();
    }
    async undislikeAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+dislikingAnswers');
        const index = me.dislikingAnswers.map(i=>i.toString()).indexOf(ctx.params.id);
        if(index>-1){
            me.dislikingAnswers.splice(index,1);
            me.save();
        }
        ctx.status = 204;
    }
}

module.exports = new UsersCtl();