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
                        <h2 className="font-bold font-momo w-[350px] md:w-full text-[24px] md:text-[48px] mb-4 opacity-0 animate-fadeUp">
                            <span className="text-nbared">{predictionData.player}</span> vs {predictionData.opponent}
                        </h2>
                    </div>

                    <FadeSection delay="0.5s">
                        <div className="flex flex-col
                            w-[350px] md:w-[700px] 
                            rounded-xl px-4 py-4 md:px-6 md:py-6  
                            bg-secondary 
                            mb-40 md:mb-80 
                            text-left 
                            text-sm md:text-lg
                        ">
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Minutes</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{predictionData.predictions.minutes.toFixed(2)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Points</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.points)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Rebounds</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.total_rebounds)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Assists</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.assists)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Blocks</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.blocks)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Steals</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.steals)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Field Goal Percent</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.fg_percent * 100)}%</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Three Pointers Attempted</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.threepa)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Three Pointers</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.threep)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Three Point Percent</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(threep_percent)}%</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Free Throws Attempted</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.fta)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Free Throws</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.ft)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Free Throw Percent</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(ft_percent)}%</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Personal Fouls</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.personal_fouls)}</p>
                            </div>
                            <div className="flex flex-row gap-4 items-center hover:bg-accent transition duration-200 ease-in-out px-4 py-1 rounded-full">
                                <p>Turnovers</p>
                                <div className="flex-1 h-px bg-white/15" />
                                <p>{Math.round(predictionData.predictions.turnovers)}</p>
                            </div>
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
                    <p className="text-[24px] md:text-[32px]">Loading prediction...</p>
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