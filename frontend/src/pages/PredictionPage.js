import PlayerPredict from '../components/PlayerPredict';
import { useNavigate, useLocation } from 'react-router-dom';
import useInView from '../hooks/useInView';

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
        <div className="mt-20 mb-40">
            <PlayerPredict name={name} team={team} opponent={opponent} date={date} home={home} />
            <FadeSection delay="0.2s">
                <button className="rounded-lg h-[40px] w-[300px] px-4 font-bold bg-nbared hover:bg-nbared2 transition duration-200 ease-in-out" onClick={handleClickToHomePage}>Get more predictions!</button>
            </FadeSection>
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