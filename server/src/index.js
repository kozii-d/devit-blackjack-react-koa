const path = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const niv = require('node-input-validator');
const mongoose = require('mongoose');

const PORT = 3000;
const app = new Koa();
const router = require("./routes/router");

mongoose.connect('mongodb://localhost:27017/blackjack').then(async () => {
    console.log('Connected to the database');

    app.use(serve(path.join(__dirname, '../public/static')));

    app.use(niv.koa());
    app.use(router.routes());

    app.listen(PORT);
});

