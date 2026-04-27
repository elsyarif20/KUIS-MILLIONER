/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Phone, 
  HelpCircle, 
  RotateCcw, 
  CheckCircle2, 
  XCircle,
  Clock,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_DATA, PRIZE_LADDER, type Question } from './constants';
import { askFriend } from './lib/gemini';

type GameStatus = 'start' | 'playing' | 'checking' | 'lost' | 'won' | 'waiting';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentLevel, setCurrentLevel] = useState(0); // 0 to 14 (15 questions)
  const [status, setStatus] = useState<GameStatus>('start');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [lockedIdx, setLockedIdx] = useState<number | null>(null);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    askAudience: true,
    phoneFriend: true,
  });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  const [audienceData, setAudienceData] = useState<number[] | null>(null);
  const [friendResponse, setFriendResponse] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [timer, setTimer] = useState(10);
  const [lastWinPrize, setLastWinPrize] = useState("Rp 0");
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [heartbeatInterval, setHeartbeatInterval] = useState<NodeJS.Timeout | null>(null);
  const [droneOsc, setDroneOsc] = useState<OscillatorNode | null>(null);

  const currentQuestion = questions[currentLevel];

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtx) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioCtx(ctx);
      return ctx;
    }
    return audioCtx;
  };

  const stopTenseMusic = useCallback(() => {
    if (heartbeatInterval) {
      clearTimeout(heartbeatInterval as any);
      setHeartbeatInterval(null);
    }
    if (droneOsc) {
      droneOsc.stop();
      droneOsc.disconnect();
      setDroneOsc(null);
    }
  }, [heartbeatInterval, droneOsc]);

  const playTenseMusic = useCallback((ctx: AudioContext) => {
    if (heartbeatInterval || droneOsc) return;

    // 1. Low Frequency Drone (Atmosphere)
    const drone = ctx.createOscillator();
    const droneGain = ctx.createGain();
    drone.type = 'sawtooth'; // Gritty sound
    drone.frequency.setValueAtTime(40, ctx.currentTime);
    droneGain.gain.setValueAtTime(0.05, ctx.currentTime);
    
    // Add low pass filter to make it "deep"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(100, ctx.currentTime);

    drone.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(ctx.destination);
    drone.start();
    setDroneOsc(drone);

    // 2. Pulse (Heartbeat) - Dynamic rate
    const playPulse = () => {
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    };

    // Recursive timeout to allow dynamic frequency change
    let nextPulse: NodeJS.Timeout;
    const schedulePulse = () => {
      playPulse();
      // Speed up as timer goes down (from 1s to 0.4s intervals)
      const currentTimer = parseInt(document.getElementById('timer-val')?.innerText || '10');
      const delay = Math.max(400, currentTimer * 100);
      nextPulse = setTimeout(schedulePulse, delay);
      setHeartbeatInterval(nextPulse);
    };

    schedulePulse();
  }, [heartbeatInterval, droneOsc]);

  const speak = (text: string, isMotivational = false) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; 
      utterance.rate = isMotivational ? 1.1 : 0.9; 
      utterance.pitch = isMotivational ? 1.1 : 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleGameOver = useCallback(() => {
    stopTenseMusic();
    // Calculate final prize based on safety points
    let finalPrize = "Rp 0";
    if (currentLevel >= 10) {
      finalPrize = PRIZE_LADDER.find(p => p.level === 10)?.prize || "Rp 0";
    } else if (currentLevel >= 5) {
      finalPrize = PRIZE_LADDER.find(p => p.level === 5)?.prize || "Rp 0";
    }
    setLastWinPrize(finalPrize);
    setStatus('lost');
    speak("Masya Allah! Sayang sekali, waktu habis atau jawaban kamu salah. Astagfirullah, ayo coba lagi!", true);
  }, [currentLevel, stopTenseMusic]);

  // Helper to shuffle array
  const shuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && status === 'playing') {
      handleGameOver();
    }
    return () => clearInterval(interval);
  }, [status, timer]);

  // Manage Tense Sound State
  useEffect(() => {
    if (status === 'playing' && audioCtx) {
      playTenseMusic(audioCtx);
    } else {
      stopTenseMusic();
    }
  }, [status, audioCtx, playTenseMusic, stopTenseMusic]);

  const startNewGame = () => {
    const ctx = initAudio();
    
    // Pick 15 random questions and shuffle their options
    const picked = shuffle(QUIZ_DATA).slice(0, 15).map(q => {
      const originalCorrectText = q.options[q.correctAnswer];
      const shuffledOptions = shuffle(q.options);
      const newCorrectIdx = shuffledOptions.indexOf(originalCorrectText);
      return { ...q, options: shuffledOptions, correctAnswer: newCorrectIdx };
    });
    
    setQuestions(picked);
    setCurrentLevel(0);
    setStatus('playing');
    setSelectedIdx(null);
    setLockedIdx(null);
    setLifelines({ fiftyFifty: true, askAudience: true, phoneFriend: true });
    setHiddenOptions([]);
    setAudienceData(null);
    setFriendResponse(null);
    setTimer(10);
    if (ctx) playTenseMusic(ctx);
  };

  const handleSelectOption = (idx: number) => {
    if (status !== 'playing' || hiddenOptions.includes(idx)) return;
    setSelectedIdx(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedIdx === null || status !== 'playing') return;
    
    setLockedIdx(selectedIdx);
    setStatus('checking');

    setTimeout(() => {
      if (selectedIdx === currentQuestion.correctAnswer) {
        // Correct
        speak("Masha Allah! Luar Biasa! Jawaban kamu tepat sekali, Beribu-ribu Alhamdulillah!", true);
        if (currentLevel === 14) {
          // Final Win
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
          setLastWinPrize(PRIZE_LADDER[0].prize);
          setStatus('won');
        } else {
          // Next Level
          setTimeout(() => {
            setCurrentLevel(prev => prev + 1);
            setSelectedIdx(null);
            setLockedIdx(null);
            setHiddenOptions([]);
            setAudienceData(null);
            setFriendResponse(null);
            setTimer(10);
            setStatus('playing');
          }, 1500);
        }
      } else {
        // Wrong
        speak("Astagfirullah! Jawaban itu kurang tepat. Tetap semangat, jangan menyerah ya!", true);
        setTimeout(() => {
          handleGameOver();
        }, 1500);
      }
    }, 2000);
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || status !== 'playing') return;
    
    const correct = currentQuestion.correctAnswer;
    const incorrect = [0, 1, 2, 3].filter(i => i !== correct);
    const toHide: number[] = [];
    
    while (toHide.length < 2) {
      const randomIdx = Math.floor(Math.random() * incorrect.length);
      const val = incorrect[randomIdx];
      if (!toHide.includes(val)) {
        toHide.push(val);
      }
    }
    
    setHiddenOptions(toHide);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
  };

  const useAskAudience = () => {
    if (!lifelines.askAudience || status !== 'playing') return;
    
    const correct = currentQuestion.correctAnswer;
    const data = [0, 0, 0, 0];
    let remaining = 100;
    
    // Give more weight to correct answer
    const correctWeight = 40 + Math.floor(Math.random() * 40);
    data[correct] = correctWeight;
    remaining -= correctWeight;
    
    for (let i = 0; i < 4; i++) {
      if (i === correct) continue;
      if (i === 3 || (i === 2 && correct === 3)) {
        data[i] = remaining;
      } else {
        const weight = Math.floor(Math.random() * remaining);
        data[i] = weight;
        remaining -= weight;
      }
    }
    
    setAudienceData(data);
    setLifelines(prev => ({ ...prev, askAudience: false }));
  };

  const usePhoneFriend = async () => {
    if (!lifelines.phoneFriend || status !== 'playing') return;
    
    setIsCalling(true);
    const response = await askFriend(currentQuestion.text, currentQuestion.options);
    setFriendResponse(response);
    setIsCalling(false);
    setLifelines(prev => ({ ...prev, phoneFriend: false }));
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white p-8 flex flex-col font-sans overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 shrink-0">
        <div className="flex flex-col">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">Pemain</span>
          <span className="text-2xl font-semibold text-slate-100">Cerdas PAI</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-blue-900 bg-slate-900 flex items-center justify-center shadow-lg shadow-blue-900/20 overflow-hidden">
             <div className="text-center leading-tight">
                <div className="text-[8px] lg:text-[10px] text-blue-300 font-bold uppercase tracking-tighter">WHO WANTS TO BE A</div>
                <div className="text-sm lg:text-lg font-black text-white uppercase">MILLIONAIRE</div>
             </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-1">Lifelines</span>
          <div className="flex gap-3">
            <button 
              onClick={useFiftyFifty}
              disabled={!lifelines.fiftyFifty || status !== 'playing'}
              className="lifeline-btn"
            >
              50:50
            </button>
            <button 
              onClick={usePhoneFriend}
              disabled={!lifelines.phoneFriend || status !== 'playing' || isCalling}
              className="lifeline-btn"
            >
              {isCalling ? "..." : "📞"}
            </button>
            <button 
              onClick={useAskAudience}
              disabled={!lifelines.askAudience || status !== 'playing'}
              className="lifeline-btn"
            >
              👥
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-8 overflow-hidden min-h-0">
        {/* Main Game/Content Area */}
        <div className="flex-[3] flex flex-col min-h-0 relative">
          <AnimatePresence mode="wait">
            {status === 'start' && (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1 flex flex-col items-center justify-center text-center z-10 p-12 rounded-3xl bg-slate-900 border border-blue-500/20 backdrop-blur-xl glow-blue"
              >
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 drop-shadow-lg" />
                <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-slate-100 uppercase tracking-tighter">
                  Edisi Millionaire PAI
                </h2>
                <p className="text-lg text-blue-300/80 mb-10 leading-relaxed max-w-lg">
                  Uji pengetahuan agamamu dan jadilah seorang Milyarder! 15 pertanyaan menuju Rp 1 Miliar.
                </p>
                <button 
                  onClick={startNewGame}
                  className="group relative inline-flex items-center justify-center px-12 py-4 font-bold text-white transition-all duration-200 bg-blue-700 rounded-full hover:bg-blue-600 active:scale-95 shadow-xl shadow-blue-900/40"
                >
                  <Play className="mr-2 w-5 h-5 fill-current" />
                  Mulai Kuis
                </button>
              </motion.div>
            )}

            {(status === 'playing' || status === 'checking' || status === 'waiting') && (
              <motion.div 
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-end pb-8 min-h-0"
              >
                {/* Timer Display Overlay */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-2 bg-slate-900 border border-blue-500/30 px-6 py-2 rounded-full backdrop-blur-md shadow-2xl">
                     <Clock className={`w-5 h-5 ${timer < 10 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`} />
                     <span id="timer-val" className={`text-xl font-mono font-bold ${timer < 10 ? 'text-red-500' : 'text-white'}`}>
                       {timer}s
                     </span>
                  </div>
                </div>

                {/* Question Area */}
                <div className="relative mb-10 shrink-0">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
                  <div className="bg-slate-900 border-2 border-blue-500 rounded-2xl p-10 text-center shadow-2xl shadow-blue-500/10">
                    <p className="text-blue-400 font-mono text-sm mb-4 uppercase tracking-widest font-bold">TINGKAT {currentLevel + 1} • {PRIZE_LADDER[14 - currentLevel].prize}</p>
                    <p className="text-2xl lg:text-3xl font-medium leading-relaxed drop-shadow-sm">
                      {currentQuestion.text}
                    </p>
                  </div>
                </div>

                {/* Answers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 shrink-0 relative">
                  {currentQuestion.options.map((option, idx) => {
                    const isHidden = hiddenOptions.includes(idx);
                    const isCorrect = status === 'checking' && lockedIdx !== null && idx === currentQuestion.correctAnswer;
                    const isWrong = status === 'checking' && lockedIdx === idx && idx !== currentQuestion.correctAnswer;
                    const isSelected = selectedIdx === idx;
                    const isLocked = lockedIdx === idx;
                    const letter = String.fromCharCode(65 + idx);

                    return (
                      <div key={idx} className="relative group">
                        {idx % 2 === 0 ? (
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-blue-500/50"></div>
                        ) : (
                          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-4 h-[1px] bg-blue-500/50"></div>
                        )}
                        <button
                          onClick={() => handleSelectOption(idx)}
                          disabled={isHidden || status !== 'playing'}
                          className={`answer-button transition-all duration-500 ${
                            isHidden ? 'opacity-0 scale-95 pointer-events-none' : 
                            isCorrect ? 'correct ring-2 ring-green-400 ring-offset-4 ring-offset-slate-950' : 
                            isWrong ? 'wrong' : 
                            isLocked ? 'selected' : 
                            isSelected ? 'border-yellow-500 bg-blue-900/50' : ''
                          }`}
                        >
                          <span className="text-yellow-500 font-bold mr-4 uppercase">{letter}:</span>
                          <span className={isHidden ? 'hidden' : 'truncate'}>{option}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Action Message/Confirm Overlay */}
                <div className="h-16 flex items-center justify-center mt-6">
                  <AnimatePresence>
                    {selectedIdx !== null && status === 'playing' && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={handleConfirmAnswer}
                        className="px-12 py-3 rounded-full bg-yellow-600 text-slate-950 font-black transition-all hover:bg-yellow-500 uppercase tracking-widest text-sm shadow-xl shadow-yellow-900/20"
                      >
                        JAWABAN AKHIR?
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Lifeline Results */}
                <AnimatePresence>
                  {audienceData && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute top-20 left-12 w-64 bg-slate-900 border border-blue-500/50 backdrop-blur-xl p-5 rounded-2xl z-20 shadow-2xl overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                         <h4 className="font-bold flex items-center gap-2 text-blue-400 text-xs uppercase tracking-widest"><Users className="w-4 h-4" /> Polling</h4>
                         <button onClick={() => setAudienceData(null)} className="text-[10px] text-slate-500 uppercase font-bold hover:text-white">Tutup</button>
                      </div>
                      <div className="space-y-3">
                        {audienceData.map((val, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-4 font-bold text-[10px] text-yellow-500">{String.fromCharCode(65 + i)}</span>
                            <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-blue-900/30">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                className="h-full bg-blue-600" 
                              />
                            </div>
                            <span className="w-6 text-[10px] font-mono text-slate-400">{val}%</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {friendResponse && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="absolute bottom-4 left-4 w-full max-w-sm bg-blue-950 border border-blue-400/30 backdrop-blur-xl p-5 rounded-2xl z-20 shadow-2xl"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-800 flex items-center justify-center shrink-0 border border-blue-400/50">
                          <Phone className="text-white w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-100 text-sm italic leading-relaxed font-medium">"{friendResponse}"</p>
                        </div>
                        <button onClick={() => setFriendResponse(null)} className="text-slate-500 hover:text-white">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {status === 'lost' && (
              <motion.div 
                key="lost"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center z-10 bg-slate-900/80 border border-red-500/30 backdrop-blur-xl p-12 rounded-3xl"
              >
                <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-4xl font-bold mb-2 uppercase tracking-tighter">Game Over</h2>
                <p className="text-slate-400 mb-8 leading-relaxed max-w-sm mx-auto">
                  Sayang sekali, anda gagal membawa pulang Rp 1 Miliar. <br/> Namun, anda berhak membawa pulang 
                  <span className="block text-3xl font-black text-yellow-500 mt-2 font-mono drop-shadow-md">{lastWinPrize}</span>
                </p>
                <button 
                  onClick={startNewGame}
                  className="px-10 py-4 rounded-full bg-white text-slate-950 font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
                >
                  <RotateCcw className="w-5 h-5" /> COBA LAGI
                </button>
              </motion.div>
            )}

            {status === 'won' && (
              <motion.div 
                key="won"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 flex flex-col items-center justify-center text-center z-10 bg-slate-900 border border-yellow-500/30 backdrop-blur-xl p-12 rounded-3xl"
              >
                <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <CheckCircle2 className="w-16 h-16 text-yellow-500" />
                </div>
                <h2 className="text-5xl font-black mb-2 text-white uppercase tracking-tighter italic">MILYARDER!</h2>
                <p className="text-blue-200 mb-8 text-xl font-medium">
                  Selamat! Anda telah menjawab 15 pertanyaan Pendidikan Agama Islam dengan sempurna.
                </p>
                <div className="mb-10 py-10 px-8 bg-gradient-to-br from-yellow-600/10 to-transparent rounded-3xl border border-yellow-500/30 shadow-inner">
                  <span className="text-6xl font-black text-yellow-500 font-mono tracking-tighter drop-shadow-2xl">
                    RP 1.000.000.000
                  </span>
                </div>
                <button 
                  onClick={startNewGame}
                  className="px-12 py-4 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all active:scale-95 shadow-2xl shadow-yellow-900/40"
                >
                  <RotateCcw className="w-5 h-5" /> MAIN LAGI
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Money Ladder Area - 1/4 Width */}
        <div className="prize-ladder-container w-full max-w-[280px]">
          <div className="space-y-1">
            {PRIZE_LADDER.map((step) => {
              const isActive = 15 - step.level === currentLevel;
              const isPast = 15 - step.level < currentLevel;
              const isFuture = 15 - step.level > currentLevel;

              return (
                <div 
                  key={step.level}
                  className={`prize-step ${
                    isActive ? 'current' : 
                    isPast ? 'past' :
                    step.isSafePoint ? 'safe' : 'normal'
                  } ${isFuture ? 'opacity-30' : ''}`}
                >
                  <span className="text-[10px] w-6 opacity-60">{step.level}</span>
                  <span className="flex-1 text-right">{step.prize}</span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-blue-900/50">
            <div className="text-center">
              <div className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">HADIAH SAAT INI</div>
              <div className="text-2xl font-black text-yellow-500 drop-shadow-md">
                {currentLevel > 0 ? PRIZE_LADDER[15 - currentLevel].prize : "Rp 0"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metadata */}
      <div className="mt-8 flex justify-between items-end border-t border-slate-800 pt-4 shrink-0">
        <div className="flex gap-12">
           <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Kategori</div>
              <div className="text-sm font-semibold text-slate-300">Pendidikan Agama Islam</div>
           </div>
           <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Kesulitas</div>
              <div className="text-sm font-semibold text-yellow-500 italic">Progressive</div>
           </div>
        </div>
        <div className="text-[10px] text-slate-600 font-mono italic tracking-tight">
          SESSION_ID: AI-{Math.random().toString(36).substr(2, 6).toUpperCase()}-2026
        </div>
      </div>
    </div>
  );
}
