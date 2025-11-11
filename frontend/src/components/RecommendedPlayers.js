import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecommendedPlayers({ name, team, opponent }) {
    const [recommendedPlayers, setRecommendedPlayers] = useState([]);

    useEffect(() => {
        const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
        fetch(`${API_BASE}/api/players/`)
            .then(response => response.json())
            .then(data => {
                const filteredPlayers = data.filter(player => (player.team === team || player.team === opponent) && player.name !== name);
                setRecommendedPlayers(filteredPlayers);
            })
    }, [name, team, opponent]);

    return (
        <div className="flex flex-col items-center">
            <div>
                <h3 className="font-bold text-[24px] mb-4">Recommended predictions</h3>
            </div>
            <div className="w-[500px] max-h-[400px] overflow-y-auto bg-secondary rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mb-10">
                <ul className="p-6">
                    {recommendedPlayers.map((player) => 
                        <li key={player.id}>
                            <PlayerCard name={player.name} team={player.team} />
                        </li>
                    )}
                </ul>
            </div>
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
            <button className="rounded-lg p-2 w-[450px] px-4 text-left font-semibold bg-accent shadow-lg hover:bg-secondary transition duration-200 ease-in-out mb-2" onClick={handleClick}>{name} | {team}</button>
        </div>
    )
}