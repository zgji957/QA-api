const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const { secret } = require('../config');
class UsersCtl {
    async find(ctx){
        ctx.body = await User.find()
    }
    async findById(ctx){
        const {fields} = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(i=>' +'+i).join('');
        const user = await User.findById(ctx.params.id).select(selectFields);
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
    async listFollowing(ctx){
        
    }
}

module.exports = new UsersCtl();