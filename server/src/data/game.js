const Card = require('./card')
const mongoose = require("mongoose");

// module.exports = class Game {
//     #cardsDeck = [];
//     players;
//     winners = [];
//     #idIndex = 0;
//     #arrayOfPlayerId = [];
//     acitvePlayerId = 0;
//     isEndGame = false;
//
//     #suits = ['♣', '♠', '♥', '♦'];
//     #highCards = ['J', 'Q', 'K', 'A'];
//
//     constructor(players = []) {
//         this.players = players;
//         this.fullId();
//         this.setNextPlayerId();
//         this.createCardsDeck();
//         this.firstHand();
//     }
//
//     fullId() {
//         this.players.forEach(player => {
//             this.#arrayOfPlayerId.push(player.getPlayerId);
//         })
//     }
//
//     checkEndGame() {
//         if (!this.#arrayOfPlayerId.length) {
//             this.isEndGame = true;
//         }
//     }
//
//     setNextPlayerId() {
//         this.#idIndex = 0;
//         this.acitvePlayerId = this.#arrayOfPlayerId[this.#idIndex++];
//     }
//
//     createCardsDeck() {
//         this.#suits.forEach((suit) => {
//             for (let i = 2; i <= 10; i++) {
//                 this.#cardsDeck.push(new Card(`${i}`, suit, i));
//             }
//             this.#highCards.forEach(card => {
//                 this.#cardsDeck.push(new Card(`${card}`, suit, card === 'A' ? 11 : 10));
//
//             })
//         });
//
//         this.#cardsDeck = [...this.#cardsDeck, ...this.#cardsDeck, ...this.#cardsDeck, ...this.#cardsDeck];
//         this.#cardsDeck = this.#cardsDeck.sort(() => 0.5 - Math.random());
//     }
//
//     moveWinner(player) {
//         if (player.isStand && !player.isLose) {
//             this.winners.push(player);
//         }
//     }
//
//     defineWinner() {
//         if (this.winners.length === 1) {
//             return;
//         }
//         if (this.winners.length > 1) {
//             this.winners = this.winners.sort((a, b) => {
//                 return b.getPlayerScore - a.getPlayerScore;
//             });
//             this.winners = this.winners.filter(player => player.getPlayerScore === this.winners[0].getPlayerScore);
//         }
//     }
//
//     firstHand() {
//         this.players.forEach(player => {
//             player.cards.push(this.#cardsDeck.shift());
//             player.cards.push(this.#cardsDeck.shift());
//             player.updatePlayer();
//             this.moveWinner(player);
//
//             if (player.getPlayerScore === 21) {
//                 this.#arrayOfPlayerId.splice(this.#arrayOfPlayerId.indexOf(player.getPlayerId), 1);
//                 this.acitvePlayerId = this.#arrayOfPlayerId[0];
//             }
//         });
//         this.defineWinner();
//         this.checkEndGame();
//     }
//
//     hit() {
//         const player = this.players.find(elem => elem.getPlayerId === this.acitvePlayerId);
//         player.cards.push(this.#cardsDeck.shift());
//         player.updatePlayer();
//         if (player.getPlayerScore === 21) {
//             this.stand(this.acitvePlayerId);
//         }
//         if (player.getPlayerScore > 21) {
//             this.#arrayOfPlayerId.splice(this.#arrayOfPlayerId.indexOf(player.getPlayerId), 1);
//             this.setNextPlayerId();
//         }
//         this.defineWinner();
//         this.checkEndGame();
//     }
//
//     stand() {
//         const player = this.players.find(elem => elem.getPlayerId === this.acitvePlayerId);
//         player.isStand = true;
//         player.updatePlayer();
//         this.moveWinner(player);
//         this.#arrayOfPlayerId.splice(this.#arrayOfPlayerId.indexOf(player.getPlayerId), 1)
//         this.defineWinner();
//         this.setNextPlayerId();
//         this.checkEndGame();
//     }
//
//
// }

// mongoose.connect('mongodb://localhost:27017/blackjack').then(async () => {
//     console.log('start');
//
//     const cardSchema = new mongoose.Schema({
//         name: String,
//         suit: String,
//         weight: Number
//     });
//
//     cardSchema.methods = {
//         getCardName: function () {
//             return this.name;
//         },
//         getCardSuit: function () {
//             return this.suit;
//         },
//         getCardWeight: function () {
//             return this.weight;
//         },
//         setCardWeight: function (weight) {
//             this.weight = weight;
//         }
//     }
//
//
//     const playerSchema = new mongoose.Schema({
//         score: Number,
//         name: String,
//         cards: [cardSchema],
//         isLose: Boolean,
//         isStand: Boolean
//     });
//
//
//     playerSchema.methods = {
//         resetPlayer: function () {
//             this.cards = [];
//             this.score = 0;
//             this.isLose = false;
//             this.isStand = false;
//         },
//         setScore: function () {
//             this.score = this.cards.reduce((accumulator, currentValue) => {
//                 return accumulator + currentValue.getCardWeight();
//             }, 0);
//         },
//         getPlayerScore: function () {
//             return this.score;
//         },
//         getPlayerName: function () {
//             return this.name;
//         },
//         getPlayerId: function () {
//             return this.id;
//         },
//         checkWin: function () {
//             if (this.score === 21) {
//                 this.isStand = true;
//             }
//             if (this.score > 21) {
//                 this.isLose = true;
//                 this.isStand = true;
//             }
//         },
//         checkAce: function () {
//             const ace = this.cards.find((card) => card.getCardName() === 'A');
//             if (this.score > 21 && ace) {
//                 ace.setCardWeight(1);
//                 this.setScore();
//             }
//         },
//         updatePlayer: function () {
//             this.setScore();
//             this.checkAce();
//             this.checkWin();
//         }
//
//     }
//
//
//     const gameSchema = new mongoose.Schema({
//         cardsDeck: [cardSchema],
//         players: [playerSchema],
//         winners: Array,
//         idIndex: Number,
//         arrayOfPlayerId: Array,
//         acitvePlayerId: String,
//         isEndGame: Boolean,
//         suits: Array,
//         highCards: Array
//     });
//
//     gameSchema.methods = {
//         fullId: function () {
//             this.players.forEach(player => {
//                 this.arrayOfPlayerId.push(player.getPlayerId());
//             })
//         },
//         checkEndGame: function () {
//             if (!this.arrayOfPlayerId.length) {
//                 this.isEndGame = true;
//             }
//         },
//         setNextPlayerId: function () {
//             this.idIndex = 0;
//             this.acitvePlayerId = this.arrayOfPlayerId[this.idIndex++];
//         },
//         createCardsDeck: function () {
//             this.suits.forEach((suit) => {
//                 for (let i = 2; i <= 10; i++) {
//                     this.cardsDeck.push({name: `${i}`, suit, weight: i});
//                 }
//                 this.highCards.forEach(card => {
//                     this.cardsDeck.push({name: `${card}`, suit, weight: card === 'A' ? 11 : 10});
//                 })
//             });
//
//             this.cardsDeck = [...this.cardsDeck, ...this.cardsDeck, ...this.cardsDeck, ...this.cardsDeck];
//             this.cardsDeck = this.cardsDeck.sort(() => 0.5 - Math.random());
//         },
//         moveWinner: function (player) {
//             if (player.isStand && !player.isLose) {
//                 this.winners.push(player);
//             }
//         },
//         defineWinner() {
//             if (this.winners.length === 1) {
//                 return;
//             }
//             if (this.winners.length > 1) {
//                 this.winners = this.winners.sort((a, b) => {
//                     return b.getPlayerScore() - a.getPlayerScore();
//                 });
//                 this.winners = this.winners.filter(player => player.getPlayerScore() === this.winners[0].getPlayerScore());
//             }
//         },
//         firstHand: function () {
//             this.players.forEach(player => {
//                 player.cards.push(this.cardsDeck.shift());
//                 player.cards.push(this.cardsDeck.shift());
//                 player.updatePlayer();
//                 this.moveWinner(player);
//
//                 if (player.getPlayerScore() === 21) {
//                     this.arrayOfPlayerId.splice(this.arrayOfPlayerId.indexOf(player.getPlayerId()), 1);
//                     this.acitvePlayerId = this.arrayOfPlayerId[0];
//                 }
//             });
//             this.defineWinner();
//             this.checkEndGame();
//         },
//         hit: function () {
//             const player = this.players.find(elem => elem.getPlayerId() === this.acitvePlayerId);
//             player.cards.push(this.cardsDeck.shift());
//             player.updatePlayer();
//             if (player.getPlayerScore() === 21) {
//                 this.stand(this.acitvePlayerId);
//             }
//             if (player.getPlayerScore() > 21) {
//                 this.arrayOfPlayerId.splice(this.arrayOfPlayerId.indexOf(player.getPlayerId()), 1);
//                 this.setNextPlayerId();
//             }
//             this.defineWinner();
//             this.checkEndGame();
//             this.save();
//         },
//         stand: function () {
//             const player = this.players.find(elem => elem.getPlayerId() === this.acitvePlayerId);
//             player.isStand = true;
//             player.updatePlayer();
//             this.moveWinner(player);
//             this.arrayOfPlayerId.splice(this.arrayOfPlayerId.indexOf(player.getPlayerId()), 1)
//             this.defineWinner();
//             this.setNextPlayerId();
//             this.checkEndGame();
//             this.save();
//         }
//
//     }
//
//     const Game = mongoose.model('Game', gameSchema);

    // const game = new Game({
    //     cardsDeck: [],
    //     players: [
    //         {
    //             score: 0,
    //             name: 'abc',
    //             cards: [],
    //             isLose: false,
    //             isStand: false
    //         },
    //         {
    //             score: 0,
    //             name: 'bbb',
    //             cards: [],
    //             isLose: false,
    //             isStand: false
    //         },
    //     ],
    //     winners: [],
    //     idIndex: 0,
    //     arrayOfPlayerId: [],
    //     acitvePlayerId: null,
    //     isEndGame: false,
    //     suits: ['♣', '♠', '♥', '♦'],
    //     highCards: ['J', 'Q', 'K', 'A']
    // });
    //
    // game.fullId();
    // game.setNextPlayerId();
    // game.createCardsDeck();
    // game.firstHand();

    // await game.save();

    // const g = await Game.findOne({});
    // g.stand();
    // console.log(g)
// });
