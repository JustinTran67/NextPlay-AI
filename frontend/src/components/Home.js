// react
import React, { useState, useEffect } from 'react';
// router
import { useNavigate } from 'react-router-dom';
// hooks
import useInView from '../hooks/useInView';
// assets
import logo from '../assets/Logo.png';

const teams = [
    "Atlanta Hawks",
    "Boston Celtics",
    "Brooklyn Nets",
    "Charlotte Hornets",
    "Chicago Bulls",
    "Cleveland Cavaliers",
    "Dallas Mavericks",
    "Denver Nuggets",
    "Detroit Pistons",
    "Golden State Warriors",
    "Houston Rockets",
    "Indiana Pacers",
    "Los Angeles Clippers",
    "Los Angeles Lakers",
    "Memphis Grizzlies",
    "Miami Heat",
    "Milwaukee Bucks",
    "Minnesota Timberwolves",
    "New Orleans Pelicans",
    "New York Knicks",
    "Oklahoma City Thunder",
    "Orlando Magic",
    "Philadelphia 76ers",
    "Phoenix Suns",
    "Portland Trail Blazers",
    "Sacramento Kings",
    "San Antonio Spurs",
    "Toronto Raptors",
    "Utah Jazz",
    "Washington Wizards"
]

export default function Home() {
    const [players, setPlayers] = useState([]);
    const [filterPlayers, setFilterPlayers] = useState("");

    useEffect(() => {
        const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
        console.log("API base URL:", process.env.REACT_APP_API_BASE_URL); // debug line
        fetch(`${API_BASE}/api/players/`)
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(player => teams.includes(player.team));
                setPlayers(filteredData);
            })
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1 className="mb-20 flex items-center justify-center text-center tracking-wide text-5xl md:text-[64px] font-bold opacity-0 animate-fadeUp">
                NextPlay <img className="w-[75px] md:w-[100px] opacity-0 animate-growIn [animation-delay:0.2s]" src={logo} alt="NextPlay logo"></img>
            </h1>
            <SearchBar filterPlayers={filterPlayers} setFilterPlayers={setFilterPlayers} />
            <PlayerList playerData={players} filterPlayers={filterPlayers} />
            <FadeSection delay="0.2s">
                <div className="w-[350px] md:w-[600px]">
                    <p className="text-[20px] md:text-[32px] mb-4 md:mb-8 font-bold">On demand <span className="text-nbared">basketball projections</span>, looking into the future of the NBA</p>
                    <p className="text-sm md:text-xl">Search for players, enter their next game, let us predict. <span className="font-bold">Easy!</span></p>
                </div>
            </FadeSection>
        </div>
    )
}

function SearchBar({filterPlayers, setFilterPlayers}) {
    return (
        <div className="opacity-0 animate-fadeUp [animation-delay:0.5s]">
            <input className="rounded-3xl mb-10 p-2 h-[50px] w-[350px] md:w-[600px] text-[12px] md:text-[16px] px-8 bg-accent placeholder-silver"
               type="text" value={filterPlayers} onChange={(e) => setFilterPlayers(e.target.value)} placeholder="Search players to get projections..."
            />
        </div>
    )
}

function PlayerList({playerData, filterPlayers}) {
    return (
        <div className="mb-40 w-[350px] md:w-[450px] h-[400px] overflow-y-auto bg-secondary rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 opacity-0 animate-fadeUp [animation-delay:1s]">
            <ul className="p-6">
                {playerData.map((player) => 
                    {return (player.name.toLowerCase().includes(filterPlayers.toLowerCase()) || player.team.toLowerCase().includes(filterPlayers.toLowerCase())) ?
                        <li className="" key={player.id}>
                            <PlayerCard name={player.name} team={player.team} />
                        </li>
                    : null}
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
        <div className="">
            <button className="rounded-lg p-2 w-[300px] md:w-[400px] text-[12px] md:text-[16px] px-4 text-left font-semibold bg-accent shadow-lg hover:bg-secondary transition duration-200 ease-in-out mb-2" onClick={handleClick}>
                {name} | {team}
            </button>
        </div>
    )
}

// On scroll fade in component animation
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