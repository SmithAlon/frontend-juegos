import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Game {
  id: string;
  name: string;
  path: string;
}

const games: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    path: '/tictactoe'
  },
  {
    id: 'mayormenor',
    name: 'Mayor o Menor',
    path: '/mayormenor'
  }
];

export default function BotonJuego() {
  const location = useLocation();
  const navigate = useNavigate();
  const otherGame = games.find(game => game.path !== location.pathname);
  
  if (!otherGame) {
    return null; // No other game found
  }
  
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => navigate(otherGame.path)}
        className={cn(
          "text-[#F8F9FA] text-sm",
        )}
      >
        Jugar {otherGame.name}
      </button>
    </div>
  );
}