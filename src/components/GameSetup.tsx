import React, { useState } from 'react';
import { GameType } from '../types/game';
import { Users, Users2 } from 'lucide-react';

type GameSetupProps = {
  onStartGame: (gameConfig: Partial<GameType>) => void;
};

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [mode, setMode] = useState<'individual' | 'team' | null>(null);
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [teamNames, setTeamNames] = useState<string[]>(['', '']);
  const [teamPlayers, setTeamPlayers] = useState<string[][]>([[], []]);

  const handleStartGame = () => {
    if (mode === 'individual') {
      onStartGame({
        mode,
        players: playerNames.map(name => ({
          name,
          score: 0,
          scoreHistory: []
        })),
        teams: [],
        currentRound: 1,
        gameStarted: true,
        winner: null
      });
    } else {
      onStartGame({
        mode,
        players: [],
        teams: teamNames.map((name, index) => ({
          name,
          players: teamPlayers[index],
          score: 0,
          scoreHistory: []
        })),
        currentRound: 1,
        gameStarted: true,
        winner: null
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Burako</h1>
        
        {!mode ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center mb-6">Seleccionar Modo de Juego</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('individual')}
                className="flex flex-col items-center justify-center p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Users className="w-12 h-12 text-blue-500 mb-2" />
                <span className="text-lg font-medium">Partida Individual</span>
              </button>
              <button
                onClick={() => setMode('team')}
                className="flex flex-col items-center justify-center p-6 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors"
              >
                <Users2 className="w-12 h-12 text-purple-500 mb-2" />
                <span className="text-lg font-medium">Partida por Equipos</span>
              </button>
            </div>
          </div>
        ) : mode === 'individual' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Configuración de Jugadores</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Jugadores
              </label>
              <select
                value={playerCount}
                onChange={(e) => {
                  setPlayerCount(Number(e.target.value));
                  setPlayerNames(new Array(Number(e.target.value)).fill(''));
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {[2, 3, 4].map(num => (
                  <option key={num} value={num}>{num} Jugadores</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              {Array.from({ length: playerCount }).map((_, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jugador {index + 1}
                  </label>
                  <input
                    type="text"
                    value={playerNames[index] || ''}
                    onChange={(e) => {
                      const newNames = [...playerNames];
                      newNames[index] = e.target.value;
                      setPlayerNames(newNames);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={`Nombre del Jugador ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center mb-6">Configuración de Equipos</h2>
            {[0, 1].map(teamIndex => (
              <div key={teamIndex} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Equipo {teamIndex + 1}
                  </label>
                  <input
                    type="text"
                    value={teamNames[teamIndex]}
                    onChange={(e) => {
                      const newNames = [...teamNames];
                      newNames[teamIndex] = e.target.value;
                      setTeamNames(newNames);
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder={`Nombre del Equipo ${teamIndex + 1}`}
                  />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((_, playerIndex) => (
                    <input
                      key={playerIndex}
                      type="text"
                      value={teamPlayers[teamIndex][playerIndex] || ''}
                      onChange={(e) => {
                        const newTeamPlayers = [...teamPlayers];
                        if (!newTeamPlayers[teamIndex]) {
                          newTeamPlayers[teamIndex] = [];
                        }
                        newTeamPlayers[teamIndex][playerIndex] = e.target.value;
                        setTeamPlayers(newTeamPlayers);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder={`Jugador ${playerIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-4">
          {mode && (
            <>
              <button
                onClick={() => setMode(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Volver
              </button>
              <button
                onClick={handleStartGame}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                disabled={
                  mode === 'individual'
                    ? playerNames.some(name => !name.trim())
                    : teamNames.some(name => !name.trim()) || teamPlayers.some(team => !team[0]?.trim())
                }
              >
                Comenzar Juego
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}