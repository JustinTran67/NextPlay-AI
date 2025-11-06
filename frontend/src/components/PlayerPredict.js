import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlayerPredict({ name, team, opponent, date, home }) {

    const [predictionData, setPredictionData] = useState(null);
    
    useEffect (() => {
        const fetchPrediction = async () => {
            fetch('http://localhost:8000/api/player-predictions/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    'player': name,
                    'opponent': opponent,
                    'home': home,
                    'game_date': date,
                }),
            })
                .then(res => {
                    if (!res.ok) {
                    throw new Error(`Server error: ${res.status}`);
                    }
                    return res.json();
                })
                .then(data => {
                    console.log("Player Prediction:", data);
                    setPredictionData(data);
                })
                .catch(err => {
                    console.error("Fetch error:", err);
                });
        };

        fetchPrediction();
    }, [name, opponent, date, home]);
    
    return (
        <div className="flex flex-col items-center">
            {predictionData ? (
                 <div className="flex flex-col items-center">
                    <div>
                        <h2 className="font-bold text-[32px] mb-5">{predictionData.player} vs {predictionData.opponent}</h2>
                    </div>
                    <div className="w-[600px] rounded-xl p-8 bg-secondary mb-10 font-semibold text-left">
                        <p>Minutes: {predictionData.predictions.minutes.toFixed(2)}</p>
                        <p>Points: {Math.round(predictionData.predictions.points)}</p>
                        <p>Assists: {Math.round(predictionData.predictions.assists)}</p>
                        <p>Blocks: {Math.round(predictionData.predictions.blocks)}</p>
                        <p>Steals: {Math.round(predictionData.predictions.steals)}</p>
                        <p>Field Goal Percent: {Math.round(predictionData.predictions.fg_percent * 100)}%</p>  
                        <p>Three Pointers Attempted: {Math.round(predictionData.predictions.threepa)}</p>
                        <p>Three Pointers:{Math.round(predictionData.predictions.threep)}</p>
                        <p>Three Point Percent: {Math.round(predictionData.predictions.threep_percent * 100)}%</p>
                        <p>Free Throws Attempted: {Math.round(predictionData.predictions.fta)}</p>
                        <p>Free Throws: {Math.round(predictionData.predictions.ft)}</p>
                        <p>Free Throw Percent: {Math.round(predictionData.predictions.ft_percent * 100)}%</p>
                        <p>Rebounds: {Math.round(predictionData.predictions.total_rebounds)}</p>
                        <p>Personal Fouls: {Math.round(predictionData.predictions.personal_fouls)}</p>
                        <p>Turnovers: {Math.round(predictionData.predictions.turnovers)}</p>
                    </div>
                </div>
                ) : (
                     <p>Loading prediction...</p>
                )}
            <div>
                <RecommendedPlayers name={name} team={team} opponent={opponent} />
            </div>
        </div>
    )
}

function RecommendedPlayers({ name, team, opponent }) {
    const [recommendedPlayers, setRecommendedPlayers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/players/')
            .then(response => response.json())
            .then(data => {
                const filteredPlayers = data.filter(player => (player.team === team || player.team === opponent) && player.name !== name);
                setRecommendedPlayers(filteredPlayers);
            })
    }, [name, team, opponent]);

    return (
        <div className="flex flex-col items-center">
            <div>
                <h3 className="font-bold text-[24px] mb-2">Recommended predictions</h3>
            </div>
            <div className="w-[460px] rounded-xl p-8 bg-secondary mb-10">
            <ul>
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
            <button className="rounded-lg p-2 w-[400px] px-4 text-left font-semibold bg-accent shadow-lg hover:bg-secondary transition duration-200 ease-in-out mb-2" onClick={handleClick}>{name} | {team}</button>
        </div>
    )
}