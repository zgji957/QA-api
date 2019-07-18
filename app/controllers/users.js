const User = require('../models/users');

class UsersCtl {
    async find(ctx){
        ctx.body = await User.find()
    }
    async findById(ctx){
        const user = await User.findById(ctx.params.id)
        console.log('use111r',ctx.params.id)
        if(!user){
            ctx.throw(404,"用户不存在")
        }
        ctx.body=user;
         
    }
    create(ctx){
        ctx.verifyParams({
            name:{
                require:true,
                
            }
        })
        ctx.body='创建用户'; 
    }
    update(ctx){
        ctx.body='更新用户';
    }
    delete(ctx){ 
        ctx.body='删除用户';
    }
}

module.exports = new UsersCtl();