const Router = require("@koa/router");
const koaBody = require('koa-body');
const {Validator} = require('node-input-validator');
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require("path");

const Game = require("../models/Game");
const router = new Router();

const SECRET_KEY = 'OCHEN_SECRETNO';

// Middlewares
const authorizationMiddleware = (ctx, next) => {
    const token = ctx.header['authorization']

    if (!token) {
        ctx.status = 401;

        return;
    }

    let session = null;

    try {
        session = jwt.verify(token, SECRET_KEY);
    } catch (e) {
        ctx.status = 401;
        ctx.body = {error: e}

        return;
    }

    ctx.state.session = session;

    return next();
}

const checkGame = async (ctx, next) => {
    const session = ctx.state.session;
    let game = null;
    try {
        game = await Game.findById(session.id);
    } catch (e) {
        ctx.body = {error: e};

        return;
    }
    // todo: Костыль, на случай, если базы данных ещё нет, а у игрока корректный JWT. Без него не отрабатывает catch
    if (!game) {
        ctx.status = 401;

        return;
    }

    ctx.state.game = game;

    return next();
}

// Controllers
const getGameController = (ctx) => {
    ctx.body = ctx.state.game;
}

const hitAndGetGameController = async (ctx) => {
    await ctx.state.game.hit();
    ctx.body = ctx.state.game;
}

const standAndGetGameController = async (ctx) => {
    await ctx.state.game.stand();
    ctx.body = ctx.state.game;
}

const restartAndGetGameController = async (ctx) => {
    const players = ctx.state.game.players
    for (const player of players) {
        player.resetPlayer();
    }
    ctx.state.game.overwrite({
        cardsDeck: [],
        players,
        winners: [],
        idIndex: 0,
        arrayOfPlayerId: [],
        acitvePlayerId: null,
        isEndGame: false,
        suits: ['♣', '♠', '♥', '♦'],
        highCards: ['J', 'Q', 'K', 'A']
    });
    ctx.state.game.initGame();
    await ctx.state.game.save();

    ctx.body = ctx.state.game;
}

const loginController = async (ctx) => {
    const names = ctx.request.body // массив с именами игроков
    const v = new Validator({
        names
    }, {
        'names': 'required|array',
        'names.*': 'required|string'
    });

    const matched = await v.check();

    if (!matched) {
        ctx.status = 422;

        return;
    }

    const players = names.reduce((array, name) => {
        return [...array, {
            score: 0,
            name: name,
            cards: [],
            isLose: false,
            isStand: false
        }]
    }, []);

    const game = new Game({
        cardsDeck: [],
        players,
        winners: [],
        idIndex: 0,
        arrayOfPlayerId: [],
        acitvePlayerId: null,
        isEndGame: false,
        suits: ['♣', '♠', '♥', '♦'],
        highCards: ['J', 'Q', 'K', 'A']
    });
    game.initGame();

    const session = {
        id: game.id
    };

    const token = jwt.sign(session, SECRET_KEY);

    await game.save();


    ctx.body = {
        game,
        token
    }
}

const getStaticFilesController = (ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, '../../public/static/index.html'));
}

router.post('/api/login', koaBody(), loginController);
router.get('/api/game', authorizationMiddleware, checkGame, getGameController);
router.post('/api/hit', authorizationMiddleware, checkGame, hitAndGetGameController);
router.post('/api/stand', authorizationMiddleware, checkGame, standAndGetGameController);
router.post('/api/restart', authorizationMiddleware, checkGame, restartAndGetGameController);

router.get('/:url', getStaticFilesController)

module.exports = router;