import PlayerPredict from '../components/PlayerPredict';
import { Link, useLocation } from 'react-router-dom';

export default function PredictionPage() {
    const location = useLocation();
    const name = location.state?.name
    const opponent = location.state?.opponent
    const date = location.state?.date
    const home = location.state?.home

    return (
        <div>
            <Link to="/">Home</Link>
            <PlayerPredict name={name} opponent={opponent} date={date} home={home} />
        </div>
    )
}