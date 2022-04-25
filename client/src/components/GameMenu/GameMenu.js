import React from 'react';
import axios from "axios";
const GameMenu = ({updateGame}) => {

    const hit = () => {
        axios.post('/hit')
            .then(response => {
                updateGame(response.data)
            })
    }

    const stand = () => {
        axios.post('/stand')
            .then(response => {
                updateGame(response.data)
            })
    }

    return (
        <aside className="game-menu">
            <div className="game-menu__card"></div>
            <button className="game-menu__btn" id="hit" onClick={hit}>Hit</button>
            <button className="game-menu__btn" id="stand" onClick={stand}>Stand</button>
        </aside>
    );
};

export default GameMenu;