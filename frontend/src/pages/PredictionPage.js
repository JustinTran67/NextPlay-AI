import PlayerPredict from '../components/PlayerPredict';
import RecommendedPlayers from '../components/RecommendedPlayers';
import RecentGames from '../components/RecentGames';
import { useNavigate, useLocation } from 'react-router-dom';

export default function PredictionPage() {
    const location = useLocation();
    const name = location.state?.name
    const team = location.state?.team
    const opponent = location.state?.opponent
    const date = location.state?.date
    const home = location.state?.home

    const navigate = useNavigate();

    const handleClickToHomePage = () => {

        navigate('/');
    }

    return (
        <div className="">
            <PlayerPredict name={name} team={team} opponent={opponent} date={date} home={home} />
            <RecentGames playerName={name} />
            <RecommendedPlayers name={name} team={team} opponent={opponent} />
            <div>
                <button className="rounded-lg h-[40px] w-[300px] px-4 font-bold bg-nbared mb-40 hover:bg-nbared2 transition duration-200 ease-in-out" onClick={handleClickToHomePage}>Get more predictions!</button>
            </div>
        </div>
    )
}