const User = require('../models/users');

class UsersCtl {
    async find(ctx){
        ctx.body = await User.find()
    }
    async findById(ctx){
        const user = await User.findById(ctx.params.id)
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
}

module.exports = new UsersCtl();