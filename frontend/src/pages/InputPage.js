import InputGameData from '../components/InputGameData';
import { Link, useLocation } from 'react-router-dom';

export default function InputPage() {
    const location = useLocation();
    const playerName = location.state?.playerName
    const teamName = location.state?.teamName

    return (
        <div>
            <Link to="/">Home</Link>
            <InputGameData playerName={playerName} teamName={teamName}/>
        </div>
    )
}