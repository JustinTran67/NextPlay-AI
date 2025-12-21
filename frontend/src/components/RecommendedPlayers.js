import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useInView from '../hooks/useInView';

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
        <FadeSection delay="0.2s">
            <div className="text-[12px] md:text-[16px] flex flex-col items-center mt-40">
                <div>
                    <h3 className="text-[24px] font-semibold mb-4">Recommended predictions</h3>
                </div>
                <div className="w-[350px] md:w-[500px] max-h-[400px] overflow-y-auto bg-secondary rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 mb-10">
                    <ul className="p-6">
                        {recommendedPlayers.map((player) => 
                            <li className="opacity-0 animate-fadeUp [animation-delay:2.5s]" key={player.id}>
                                <PlayerCard name={player.name} team={player.team} />
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </FadeSection>
    )
}

function PlayerCard({ name, team }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/input', { state: { playerName: name, teamName: team } });
    }

    return (
        <div>
            <button className="flex flex-row justify-between rounded-lg p-2 w-[300px] md:w-[450px] px-4 text-left bg-accent shadow-lg hover:bg-secondary transition duration-200 ease-in-out mb-2" onClick={handleClick}>
                <div>
                    {name}
                </div>
                <div>
                    {team}
                </div>
            </button>
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