class UsersCtl {
    find(ctx){
        ctx.body='获取用户列表';
    }
    findById(ctx){
        ctx.throw(412,'xx')
        ctx.body='获取用户';
    }
    create(ctx){
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