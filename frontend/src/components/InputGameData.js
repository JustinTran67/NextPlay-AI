import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InputGameData({ playerName, teamName }) {
    const [gameData, setGameData] = useState({
        playerName: playerName,
        opponent: '',
        month: '',
        day: '',
        year: '',
        date: '',
        home: null,
    });

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/prediction', { state: { name: playerName, team: teamName, opponent: gameData.opponent, date: gameData.date, home: gameData.home } });
    }
    const handleDisabledClick = () => {
        alert("Please fill in all fields to get predictions.");
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
        const { name, value } = e.target;
        const updatedData = {...gameData, [name]: value}
        if(['month', 'day', 'year'].includes(name)) {
            updatedData.date = `${updatedData.year}-${updatedData.month}-${updatedData.day}`;
        }
        setGameData(updatedData);
    }
    const handleHomeChange = (e) => {
        setGameData({
            ...gameData,
            home: e.target.value
        })
    }

    return (
        <div className="rounded-xl p-8 bg-secondary">
            <h1 className="font-bold text-[32px] mb-40">Input Game Day for {gameData.playerName}</h1>
            <div className="mb-10 font-semibold">
                <select className="rounded-lg h-[40px] w-[200px] px-4 bg-accent m-1 hover:bg-secondary transition duration-200 ease-in-out" name="month" value={gameData.month} onChange={handleDateChange}>
                    <option value="">Month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <input className="rounded-lg h-[40px] w-[200px] px-4 bg-accent placeholder-silver m-1 hover:bg-secondary transition duration-200 ease-in-out" name="day" value={gameData.day} onChange={handleDateChange} placeholder="Day"></input>
                <input className="rounded-lg h-[40px] w-[200px] px-4 bg-accent placeholder-silver m-1 hover:bg-secondary transition duration-200 ease-in-out" name="year" value={gameData.year} onChange={handleDateChange} placeholder="Year"></input>
            </div>
            <div className="mb-40 font-semibold">
                <select className="rounded-lg h-[40px] w-[300px] px-4 bg-accent m-2 hover:bg-secondary transition duration-200 ease-in-out" value={gameData.opponent} onChange={handleOpponentChange}>
                    <option value="">Opponent</option>
                    {teams.map((team) => (
                        (team.includes(teamName)) ? null : <option key={team} value={team}>{team}</option>))}
                </select>

                <select className="rounded-lg h-[40px] w-[300px] px-4 bg-accent m-2 hover:bg-secondary transition duration-200 ease-in-out" value={gameData.home} onChange={handleHomeChange}>
                    <option value="">Location</option>
                    <option value={1}>Home</option>
                    <option value={0}>Away</option>
                </select>
            </div>
            <div>
                <button className="rounded-lg h-[40px] w-[300px] px-4 font-bold bg-nbared m-2 hover:bg-nbared2 transition duration-200 ease-in-out" onClick={(gameData.opponent && gameData.date && gameData.home) ? handleClick : handleDisabledClick}>
                    Get predictions!
                </button>
            </div>
        </div>
    )
}