const fs = require('fs');

module.exports = (app) => {
    console.log(fs.readdirSync(__dirname))
    fs.readdirSync(__dirname).forEach((file)=>{
        if(file==='index.js'){
            return;
        }
        const router = require(`./${file}`);
        app.use(router.routes()).use(router.allowedMethods());
    })
}