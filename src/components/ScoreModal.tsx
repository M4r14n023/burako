import React, { useState } from 'react';
import { GameType, PlayerType, TeamType } from '../types/game';
import { X } from 'lucide-react';

type ScoreModalProps = {
  game: GameType;
  onClose: () => void;
  onScoreSubmit: (scores: any) => void;
};

export default function ScoreModal({ game, onClose, onScoreSubmit }: ScoreModalProps) {
  const [step, setStep] = useState<'select-closer' | 'score-closer' | 'score-others'>('select-closer');
  const [selectedCloser, setSelectedCloser] = useState<string>('');
  const [currentScoring, setCurrentScoring] = useState<string>('');
  const [scores, setScores] = useState<Record<string, any>>({});

  const participants = game.mode === 'individual' ? game.players : game.teams;
  
  const [formData, setFormData] = useState({
    pureBurako: 0,
    impureBurako: 0,
    ones: 0,
    twos: 0,
    jokers: 0,
    tiles3to7: 0,
    tiles8to13: 0,
    tookDead: false,
    tilesToSubtract: 0,
  });

  const calculateScore = () => {
    const score = {
      closingPoints: currentScoring === selectedCloser ? 100 : 0,
      deadPoints: formData.tookDead ? 100 : -100,
      points3to7: formData.tiles3to7 * 5,
      points8to13: formData.tiles8to13 * 10,
      points1: formData.ones * 15,
      points2: formData.twos * 20,
      jokerPoints: formData.jokers * 50,
      subtractedPoints: -(formData.tilesToSubtract * 5),
      total: 0
    };

    score.total = (
      score.closingPoints +
      score.deadPoints +
      score.points3to7 +
      score.points8to13 +
      score.points1 +
      score.points2 +
      score.jokerPoints +
      score.subtractedPoints +
      (formData.pureBurako * 200) +
      (formData.impureBurako * 100)
    );

    return score;
  };

  const handleSubmitScore = () => {
    const score = calculateScore();
    
    if (currentScoring === selectedCloser) {
      setScores({ ...scores, [currentScoring]: score });
      const remainingParticipants = participants
        .filter(p => (p as any).name !== selectedCloser)
        .map(p => (p as any).name);
      
      if (remainingParticipants.length > 0) {
        setCurrentScoring(remainingParticipants[0]);
        setStep('score-others');
        setFormData({
          pureBurako: 0,
          impureBurako: 0,
          ones: 0,
          twos: 0,
          jokers: 0,
          tiles3to7: 0,
          tiles8to13: 0,
          tookDead: false,
          tilesToSubtract: 0,
        });
      } else {
        onScoreSubmit({ ...scores, [currentScoring]: score });
      }
    } else {
      onScoreSubmit({ ...scores, [currentScoring]: score });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cierre de Juego</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === 'select-closer' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">¿Quién hizo el cierre?</h3>
            <div className="space-y-2">
              {participants.map((p) => (
                <button
                  key={(p as any).name}
                  onClick={() => {
                    setSelectedCloser((p as any).name);
                    setCurrentScoring((p as any).name);
                    setStep('score-closer');
                  }}
                  className="w-full p-3 text-left rounded-lg border border-gray-300 hover:border-blue-500 hover:bg-blue-50"
                >
                  {(p as any).name}
                </button>
              ))}
            </div>
          </div>
        )}

        {(step === 'score-closer' || step === 'score-others') && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Puntos de {currentScoring}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Canastas Puras (200 pts)
                </label>
                <input
                  type="number"
                  value={formData.pureBurako}
                  onChange={(e) => setFormData({ ...formData, pureBurako: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Canastas Impuras (100 pts)
                </label>
                <input
                  type="number"
                  value={formData.impureBurako}
                  onChange={(e) => setFormData({ ...formData, impureBurako: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad de 1 (15 pts c/u)
                </label>
                <input
                  type="number"
                  value={formData.ones}
                  onChange={(e) => setFormData({ ...formData, ones: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cantidad de 2 (20 pts c/u)
                </label>
                <input
                  type="number"
                  value={formData.twos}
                  onChange={(e) => setFormData({ ...formData, twos: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comodines (50 pts c/u)
                </label>
                <input
                  type="number"
                  value={formData.jokers}
                  onChange={(e) => setFormData({ ...formData, jokers: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fichas del 3 al 7 (5 pts c/u)
                </label>
                <input
                  type="number"
                  value={formData.tiles3to7}
                  onChange={(e) => setFormData({ ...formData, tiles3to7: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fichas del 8 al 13 (10 pts c/u)
                </label>
                <input
                  type="number"
                  value={formData.tiles8to13}
                  onChange={(e) => setFormData({ ...formData, tiles8to13: parseInt(e.target.value) || 0 })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {step === 'score-others' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Levantó el "Muerto"?
                    </label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setFormData({ ...formData, tookDead: true })}
                        className={`px-4 py-2 rounded ${
                          formData.tookDead
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        Sí (+100 pts)
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, tookDead: false })}
                        className={`px-4 py-2 rounded ${
                          !formData.tookDead
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        No (-100 pts)
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Fichas para restar (5 pts c/u)
                    </label>
                    <input
                      type="number"
                      value={formData.tilesToSubtract}
                      onChange={(e) => setFormData({ ...formData, tilesToSubtract: parseInt(e.target.value) || 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmitScore}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}