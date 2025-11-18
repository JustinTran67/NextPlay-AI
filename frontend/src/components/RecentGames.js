import { useState, useEffect } from 'react';
import useInView from '../hooks/useInView';

export default function RecentGames({ playerName }) {
    const [recentGames, setRecentGames] = useState([]);

    useEffect(() => {
        const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
        fetch(`${API_BASE}/api/game-stats/?search=${encodeURIComponent(playerName)}`)
            .then(response => response.json())
            .then(data => {
                const last10 = data.slice(-10).reverse();
                setRecentGames(last10);
            })
    }, [playerName]);
    
    return (
        <FadeSection delay="0.2s">
            <div className="flex flex-col items-center mb-40">
                <h3 className="text-[32px] mb-4 font-bold">Last 10 Games</h3>
                <div className="w-[1000px] rounded-xl p-8 bg-secondary font-semibold">
                    <div className="grid grid-cols-[1fr,repeat(6,80px)] items-center mb-4 font-bold text-right">
                        <h2 className="text-left ml-10">date</h2>
                        <h2 className="mr-4">min</h2>
                        <h2 className="mr-2">pts</h2>
                        <h2 className="mr-2">reb</h2>
                        <h2 className="mr-2">ast</h2>
                        <h2 className="mr-2">stl</h2>
                        <h2 className="mr-2">blk</h2>
                    </div>
                    <FadeSection delay="0.2s">
                        <ul>
                            {recentGames.map((game, index) => (
                                <li className="" key={index}>
                                    <GameCard
                                        team={game.team}
                                        opponent={game.opponent}
                                        date={game.game_date}
                                        home={game.home}
                                        minutes={game.minutes}
                                        points={game.points}
                                        rebounds={game.total_rebounds}
                                        assists={game.assists}
                                        steals={game.steals}
                                        blocks={game.blocks}
                                    />
                                </li>
                            ))}
                        </ul>
                    </FadeSection>
                </div>
            </div>
        </FadeSection>
    )
}

function GameCard({ team, opponent, date, home, minutes, points, rebounds, assists, steals, blocks }) {
    return (
        <div className="grid grid-cols-[1fr,repeat(6,80px)] items-center mb-3 bg-accent shadow-lg rounded-lg px-4 py-2 hover:bg-secondary transition duration-200 ease-in-out text-right font-semibold font-mono text-sm">
            <p className="text-left truncate">
                {date} | {home === 1 ? `${opponent} at ${team}` : `${team} at ${opponent}`}
            </p>
            <span>{minutes ? minutes.toFixed(2) : 0}</span>
            <span>{points}</span>
            <span>{rebounds}</span>
            <span>{assists}</span>
            <span>{steals}</span>
            <span>{blocks}</span>
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