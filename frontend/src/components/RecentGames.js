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
            <div className="flex flex-col items-center mb-20 md:mb-40">
                <h3 className="text-[24px] font-semibold font-momo mb-4">Last 10 Games</h3>

                <div className="
                    w-full md:w-[1000px]
                    p-4 md:p-8
                    bg-secondary
                    rounded-xl
                    
                ">
                    {/* Header row */}
                    <div className="
                        hidden md:grid 
                        grid-cols-[1fr,repeat(6,80px)] 
                        items-center mb-4 text-right
                    ">
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
                                <li key={index}>
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
        <div
            className="
                bg-accent shadow-lg rounded-lg
                px-3 py-2 md:px-4 md:py-2
                mb-3
                font-mono
                transition duration-200 ease-in-out
                hover:bg-secondary
                text-sm
                grid grid-cols-1 md:grid-cols-[1fr,repeat(6,80px)]
                gap-2 md:gap-0
                text-left md:text-right
            "
        >
            {/* Mobile layout → stacked full width */}
            <p className="truncate md:text-left">
                {date} | {home === 1 ? `${opponent} at ${team}` : `${team} at ${opponent}`}
            </p>

            {/* Desktop-only stats row */}
            <span className="hidden md:block">{minutes ? minutes.toFixed(2) : 0}</span>
            <span className="hidden md:block">{points}</span>
            <span className="hidden md:block">{rebounds}</span>
            <span className="hidden md:block">{assists}</span>
            <span className="hidden md:block">{steals}</span>
            <span className="hidden md:block">{blocks}</span>

            {/* Mobile condensed stats */}
            <div className="flex md:hidden justify-between text-xs">
                <span>Min: {minutes ? minutes.toFixed(2) : 0}</span>
                <span>Pts: {points}</span>
                <span>Reb: {rebounds}</span>
                <span>Ast: {assists}</span>
                <span>Stl: {steals}</span>
                <span>Blk: {blocks}</span>
            </div>
        </div>
    )
}

function FadeSection({ children, delay = "0s" }) {
    const [ref, inView] = useInView();
  
    return (
      <div
        ref={ref}
        style={{ animationDelay: delay }}
        className={`opacity-0 ${inView ? "animate-fadeUp" : ""}`}
      >
        {children}
      </div>
    );
}