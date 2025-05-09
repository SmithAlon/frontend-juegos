import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  name: string;
  description: string;
  path: string;
}

const games: Game[] = [
  {
    id: 'tictactoe',
    name: 'Tic Tac Toe',
    description: 'El clásico juego de tres en línea',
    path: '/tictactoe'
  },
  {
    id: 'mayormenor',
    name: 'Mayor o Menor',
    description: 'Adivina si la siguiente carta será mayor o menor',
    path: '/mayormenor'
  }
];

export default function Selector() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  const handleGameClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-xl font-semibold mb-4">Selecciona un Juego</h1>
        
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => (
            <div
              key={game.id}
              className={`
                flex flex-col items-center justify-center
                w-64 h-32 p-4
                border-2 rounded-sm
                cursor-pointer transition-all duration-300
                ${currentPath === game.path 
                  ? 'border-[#F8F9FA] text-[#F8F9FA]' 
                  : 'border-gray-500 text-gray-500 hover:border-gray-300 hover:text-[#F8F9FA]'
                }
              `}
              onClick={() => handleGameClick(game.path)}
            >
              <h2 className="text-lg font-semibold text-center mb-2">{game.name}</h2>
              <p className="text-sm text-center line-clamp-2">{game.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}