import PlayerPredict from '../components/PlayerPredict';
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
        <div>
            <PlayerPredict name={name} team={team} opponent={opponent} date={date} home={home} />
            <div>
                <button onClick={handleClickToHomePage}>Get more predictions!</button>
            </div>
        </div>
    )
}