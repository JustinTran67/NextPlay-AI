import React, { useState, useEffect } from 'react';

export default function PlayerPredict({ name, opponent, date, home }) {

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
        </div>
    )
}