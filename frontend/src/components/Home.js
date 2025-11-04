import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [players, setPlayers] = useState([]);
    const [filterPlayers, setFilterPlayers] = useState("");

    useEffect(() => {
        fetch('http://localhost:8000/api/players/')
            .then(response => response.json())
            .then(data => setPlayers(data))
    }, []);

    return (
        <div className="front-page">
            <h1>NextPlay AI</h1>
            <SearchBar filterPlayers={filterPlayers} setFilterPlayers={setFilterPlayers} />
            <PlayerList playerData={players} filterPlayers={filterPlayers} />
        </div>
    )
}

function SearchBar({filterPlayers, setFilterPlayers}) {
    return (
        <div>
            <input type="text" value={filterPlayers} onChange={(e) => setFilterPlayers(e.target.value)} placeholder="Search players to get projections..." />
        </div>
    )
}

function PlayerList({playerData, filterPlayers}) {
    return (
        <div>
            <h2>Players</h2>
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
        <div>
            <button onClick={handleClick}> {name} | {team}</button>
        </div>
    )
}