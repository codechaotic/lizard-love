const koa = require('koa');
const body = require('koa-bodyparser');

const ENV = process.env.ENV = process.env.ENV || 'development';

var app = new koa();

app.use(async (ctx, next) => {
  try {
    await next();
    ctx.body = 'Success';
    ctx.status = 200;
  } catch (error) {
    if(ENV === 'development') ctx.status = 200;
    else ctx.status = error.status || 500;
    ctx.body = error.message;
    ctx.app.emit('error', error, ctx);
  }
});

app.on('error', (error, ctx) => {
  if(error.status) console.log(error.status, error.message);
  else console.log(error.stack || error);
});

var server  = app.listen(3000);

process.on('SIGTERM', () => {
  if(server) server.close();
});
