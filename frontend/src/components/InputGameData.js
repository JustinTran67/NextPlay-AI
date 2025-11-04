import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InputGameData({ playerName, teamName }) {
    const [gameData, setGameData] = useState({
        playerName: playerName,
        opponent: '',
        date: '',
        home: null,
    });

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/prediction', { state: { name: playerName, team: teamName, opponent: gameData.opponent, date: gameData.date, home: gameData.home } });
    }

    const teams = [
        "Atlanta Hawks",
        "Boston Celtics",
        "Brooklyn Nets",
        "Charlotte Hornets",
        "Chicago Bulls",
        "Cleveland Cavaliers",
        "Dallas Mavericks",
        "Denver Nuggets",
        "Detroit Pistons",
        "Golden State Warriors",
        "Houston Rockets",
        "Indiana Pacers",
        "Los Angeles Clippers",
        "Los Angeles Lakers",
        "Memphis Grizzlies",
        "Miami Heat",
        "Milwaukee Bucks",
        "Minnesota Timberwolves",
        "New Orleans Pelicans",
        "New York Knicks",
        "Oklahoma City Thunder",
        "Orlando Magic",
        "Philadelphia 76ers",
        "Phoenix Suns",
        "Portland Trail Blazers",
        "Sacramento Kings",
        "San Antonio Spurs",
        "Toronto Raptors",
        "Utah Jazz",
        "Washington Wizards"
    ]

    const handleOpponentChange = (e) => {
        setGameData({
            ...gameData,
            opponent: e.target.value
        })
    }
    const handleDateChange = (e) => {
        setGameData({
            ...gameData,
            date: e.target.value
        })
    }
    const handleHomeChange = (e) => {
        setGameData({
            ...gameData,
            home: e.target.value
        })
    }

    return (
        <div>
            <h1>Input Game Data for {gameData.playerName}</h1>
            <div>
                <select value={gameData.opponent} onChange={handleOpponentChange}>
                    <option value="">Opponent</option>
                    {teams.map((team) => (
                        (team.includes(teamName)) ? null : <option key={team} value={team}>{team}</option>))}
                </select>
            </div>
            <div>
                <input value={gameData.date} onChange={handleDateChange} placeholder="Date" />
            </div>
            <div>
                <select value={gameData.home} onChange={handleHomeChange}>
                    <option value="">Location</option>
                    <option value={1}>Home</option>
                    <option value={0}>Away</option>
                </select>
            </div>
            <div>
                <button onClick={handleClick}>Get predictions!</button>
            </div>
        </div>
    )
}