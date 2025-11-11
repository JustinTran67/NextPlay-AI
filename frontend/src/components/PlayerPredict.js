import React, { useState, useEffect } from 'react';

export default function PlayerPredict({ name, team, opponent, date, home }) {

    const [predictionData, setPredictionData] = useState(null);
    
    useEffect (() => {
        const fetchPrediction = async () => {
            const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
            fetch(`${API_BASE}/api/player-predictions/predict/`, {
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
        <div className="flex flex-col items-center mb-10">
            {predictionData ? (
                 <div className="flex flex-col items-center">
                    <div>
                        <h2 className="font-bold text-[32px] mb-4">{predictionData.player} vs {predictionData.opponent}</h2>
                    </div>
                    <div className="w-[700px] rounded-xl p-8 bg-secondary mb-10 font-semibold text-left text-[20px]">
                        <p>Minutes: {predictionData.predictions.minutes.toFixed(2)}</p>
                        <p>Points: {Math.round(predictionData.predictions.points)}</p>
                        <p>Rebounds: {Math.round(predictionData.predictions.total_rebounds)}</p>
                        <p>Assists: {Math.round(predictionData.predictions.assists)}</p>
                        <p>Blocks: {Math.round(predictionData.predictions.blocks)}</p>
                        <p>Steals: {Math.round(predictionData.predictions.steals)}</p>
                        <p>Field Goal Percent: {Math.round(predictionData.predictions.fg_percent * 100)}%</p>  
                        <p>Three Pointers Attempted: {Math.round(predictionData.predictions.threepa)}</p>
                        <p>Three Pointers: {Math.round(predictionData.predictions.threep)}</p>
                        <p>Three Point Percent: {Math.round(predictionData.predictions.threep_percent * 100)}%</p>
                        <p>Free Throws Attempted: {Math.round(predictionData.predictions.fta)}</p>
                        <p>Free Throws: {Math.round(predictionData.predictions.ft)}</p>
                        <p>Free Throw Percent: {Math.round(predictionData.predictions.ft_percent * 100)}%</p>
                        <p>Personal Fouls: {Math.round(predictionData.predictions.personal_fouls)}</p>
                        <p>Turnovers: {Math.round(predictionData.predictions.turnovers)}</p>
                    </div>
                </div>
                ) : (
                     <p>Loading prediction...</p>
                )}
        </div>
    )
}