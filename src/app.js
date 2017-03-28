const Koa = require('koa');
const Router = require('koa-router');
const body = require('koa-bodyparser');

const ENV = process.env.ENV = process.env.ENV || 'development';

var app = new Koa();
var router = new Router();

router.get('/random', require('./lib/random'));

app.use(async (ctx, next) => {
  try {
    await next();
    ctx.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': 0
    });
  } catch (error) {
    if(ENV === 'development') ctx.status = 200;
    else ctx.status = error.status || 500;
    ctx.body = error.message;
    ctx.app.emit('error', error, ctx);
  }
});

app.use(body());
app.use(router.routes())
app.use(router.allowedMethods());

app.on('error', (error, ctx) => {
  if(error.status) console.log(error.status, error.message);
  else console.log(error.stack || error);
});

var server  = app.listen(3000);

process.on('SIGTERM', () => {
  if(server) server.close();
});
