import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [players, setPlayers] = useState([]);
    const [filterPlayers, setFilterPlayers] = useState("");

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

    useEffect(() => {
        const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
        fetch(`${API_BASE}/api/players/`)
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(player => teams.includes(player.team));
                setPlayers(filteredData);
            })
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1 className="mt-20 mb-20 justify-center text-center tracking-wide text-[64px] font-bold">
                NextPlay AI 🏀
            </h1>
            <SearchBar filterPlayers={filterPlayers} setFilterPlayers={setFilterPlayers} />
            <PlayerList playerData={players} filterPlayers={filterPlayers} />
        </div>
    )
}

function SearchBar({filterPlayers, setFilterPlayers}) {
    return (
        <div className="">
            <input className="rounded-3xl mb-10 p-2 h-[50px] w-[600px] px-8 bg-accent placeholder-silver"
q               type="text" value={filterPlayers} onChange={(e) => setFilterPlayers(e.target.value)} placeholder="Search players to get projections..."
            />
        </div>
    )
}

function PlayerList({playerData, filterPlayers}) {
    return (
        <div className="items-center justify-center w-[450px] py-4 rounded-lg bg-secondary">
            <ul>
                {playerData.map((player) => 
                    {return (player.name.toLowerCase().includes(filterPlayers.toLowerCase()) || player.team.toLowerCase().includes(filterPlayers.toLowerCase())) ?
                        <li key={player.id}>
                            <PlayerCard name={player.name} team={player.team} />
                        </li>
                    : null}
                )}
            </ul>
        </div>
    )
}

function PlayerCard({ name, team }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/input', { state: { playerName: name, teamName: team } });
    }

    return (
        <div className="">
            <button className="rounded-lg p-2 w-[400px] px-4 text-left font-semibold bg-accent shadow-lg hover:bg-secondary transition duration-200 ease-in-out mb-2" onClick={handleClick}>
                {name} | {team}
            </button>
        </div>
    )
}