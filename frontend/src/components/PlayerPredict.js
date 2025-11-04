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
        <div>
            {predictionData ? (
                 <>
                    <h2>{predictionData.player} vs {predictionData.opponent}</h2>
                    <p>Minutes: {predictionData.predictions.minutes}</p>
                    <p>Points: {predictionData.predictions.points}</p>
                    <p>Assists: {predictionData.predictions.assists}</p>
                    <p>Blocks: {predictionData.predictions.blocks}</p>
                    <p>Steals: {predictionData.predictions.steals}</p>
                    <p>Field Goal Percent: {predictionData.predictions.fg_percent}</p>  
                    <p>Three Pointers Attempted: {predictionData.predictions.threepa}</p>
                    <p>Three Pointers:{predictionData.predictions.threep}</p>
                    <p>Three Point Percent: {predictionData.predictions.threep_percent}</p>
                    <p>Free Throws Attempted: {predictionData.predictions.fta}</p>
                    <p>Free Throws: {predictionData.predictions.ft}</p>
                    <p>Free Throw Percent: {predictionData.predictions.ft_percent}</p>
                    <p>Rebounds: {predictionData.predictions.total_rebounds}</p>
                    <p>Personal Fouls: {predictionData.predictions.personal_fouls}</p>
                    <p>Turnovers: {predictionData.predictions.turnovers}</p>
                </>
                ) : (
                     <p>Loading prediction...</p>
                )}
            <div>
                <RecommendedPlayers team={team} opponent={opponent} />
            </div>
        </div>
    )
}

function RecommendedPlayers({ team, opponent }) {
    const [recommendedPlayers, setRecommendedPlayers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/players/')
            .then(response => response.json())
            .then(data => {
                const filteredPlayers = data.filter(player => player.team === team || player.team === opponent);
                setRecommendedPlayers(filteredPlayers);
            })
    }, [team, opponent]);

    return (
        <div>
            <h3>Your next recommended predictions</h3>
            <ul>
                {recommendedPlayers.map((player) => 
                    <li key={player.id}>
                        <PlayerCard name={player.name} team={player.team} />
                    </li>
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
            <button onClick={handleClick}>{name} | {team}</button>
        </div>
    )
}