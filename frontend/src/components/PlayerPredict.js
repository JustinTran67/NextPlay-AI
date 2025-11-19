import React, { useState, useEffect } from 'react';
import RecentGames from './RecentGames';
import RecommendedPlayers from './RecommendedPlayers';
import logo from '../assets/Logo.png';
import useInView from '../hooks/useInView';

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
    
    // manually calculate three point and free throw percentages based on predicted made and attempted.
    const threep_percent = predictionData? ((Math.round(predictionData.predictions.threepa) !== 0)? Math.round(predictionData.predictions.threep) / Math.round(predictionData.predictions.threepa) * 100 : 0) : 0
    const ft_percent = predictionData? ((Math.round(predictionData.predictions.fta) !== 0)? Math.round(predictionData.predictions.ft) / Math.round(predictionData.predictions.fta) * 100 : 0) : 0

    return (
        <div className="flex flex-col items-center mb-10">
            {predictionData ? (
                <div className="flex flex-col items-center">
                    <div className="mt-12 mb-8">
                        <h2 className="font-bold w-[350px] md:w-full text-[24px] md:text-[48px] mb-4 opacity-0 animate-fadeUp">
                            <span className="text-nbared">{predictionData.player}</span> vs {predictionData.opponent}
                        </h2>
                    </div>

                    <FadeSection delay="0.5s">
                        <div className="
                            w-[350px] md:w-[700px] 
                            rounded-xl p-4 md:p-8 
                            bg-secondary 
                            mb-40 md:mb-80 
                            font-semibold 
                            text-left 
                            text-[16px] md:text-[20px]
                        ">
                            <p>Minutes: {predictionData.predictions.minutes.toFixed(2)}</p>
                            <p>Points: {Math.round(predictionData.predictions.points)}</p>
                            <p>Rebounds: {Math.round(predictionData.predictions.total_rebounds)}</p>
                            <p>Assists: {Math.round(predictionData.predictions.assists)}</p>
                            <p>Blocks: {Math.round(predictionData.predictions.blocks)}</p>
                            <p>Steals: {Math.round(predictionData.predictions.steals)}</p>
                            <p>Field Goal Percent: {Math.round(predictionData.predictions.fg_percent * 100)}%</p>
                            <p>Three Pointers Attempted: {Math.round(predictionData.predictions.threepa)}</p>
                            <p>Three Pointers: {Math.round(predictionData.predictions.threep)}</p>
                            <p>Three Point Percent: {Math.round(threep_percent)}%</p>
                            <p>Free Throws Attempted: {Math.round(predictionData.predictions.fta)}</p>
                            <p>Free Throws: {Math.round(predictionData.predictions.ft)}</p>
                            <p>Free Throw Percent: {Math.round(ft_percent)}%</p>
                            <p>Personal Fouls: {Math.round(predictionData.predictions.personal_fouls)}</p>
                            <p>Turnovers: {Math.round(predictionData.predictions.turnovers)}</p>
                        </div>
                    </FadeSection>
                    <RecentGames playerName={name} />
                    <RecommendedPlayers name={name} team={team} opponent={opponent} />
                </div>
            ) : (
                <div className="mt-40 flex flex-col items-center">
                    <img 
                        className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] animate-slowSpin mb-10" 
                        src={logo} 
                        alt="NextPlay logo"
                    />
                    <p className="text-[24px] md:text-[32px] font-bold">Loading prediction...</p>
                </div>
            )}
        </div>
    )
}

function FadeSection({ children, delay = "0s" }) {
    const [ref, inView] = useInView();
  
    return (
      <div
        ref={ref}
        style={{ animationDelay: delay }}
        className={`opacity-0 ${
          inView ? "animate-fadeUp" : ""
        }`}
      >
        {children}
      </div>
    );
}