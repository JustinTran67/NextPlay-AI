import InputGameData from '../components/InputGameData';
import RecentGames from '../components/RecentGames';
import { useLocation } from 'react-router-dom';
import useInView from '../hooks/useInView';

export default function InputPage() {
    const location = useLocation();
    const playerName = location.state?.playerName
    const teamName = location.state?.teamName

    return (
        <div className="flex flex-col items-center mt-20 mb-40">
            <InputGameData playerName={playerName} teamName={teamName}/>
            <RecentGames playerName={playerName} />
            <FadeSection delay="0.2s">
                <div className="w-[350px] md:w-[500px] p-4 rounded-lg">
                    <p className="text-[24px] md:text-[32px] font-semibold mb-4">Pro Tip</p>
                    <p className="text-md md:text-xl">Input the <span className="text-nbared font-bold">nearest upcoming game</span> for the most accurate prediction!</p>
                </div>
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