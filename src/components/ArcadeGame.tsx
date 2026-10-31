import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../utils/soundEffects';
import { Volume2, VolumeX, X, Trophy } from 'lucide-react';

interface ArcadeGameProps {
  onClose: () => void;
}

export const ArcadeGame: React.FC<ArcadeGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'title' | 'playing' | 'paused' | 'gameover'>('title');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('codeks_arcade_highscore') || '0', 10);
    }
    return 0;
  });
  const [lives, setLives] = useState(3);
  const [multiplier, setMultiplier] = useState(1);
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Store game state in refs to decouple 60fps loop from React re-renders
  const gameLoopRef = useRef<number | null>(null);
  const stateRef = useRef({
    state: 'title' as 'title' | 'playing' | 'paused' | 'gameover',
    score: 0,
    lives: 3,
    multiplier: 1,
    cameraShake: 0,
    hitstop: 0,
    player: {
      x: 400,
      y: 480,
      vx: 0,
      width: 50,
      height: 50,
      speed: 460,
    },
    tokens: [] as {
      id: number;
      x: number;
      y: number;
      text: string;
      isBug: boolean;
      speed: number;
      radius: number;
      color: string;
    }[],
    particles: [] as {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }[],
    spawnTimer: 0,
    keys: {} as Record<string, boolean>,
  });

  const toggleMute = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  const startGame = () => {
    stateRef.current.state = 'playing';
    stateRef.current.score = 0;
    stateRef.current.lives = 3;
    stateRef.current.multiplier = 1;
    stateRef.current.tokens = [];
    stateRef.current.particles = [];
    stateRef.current.player.x = 400;
    stateRef.current.player.vx = 0;
    setScore(0);
    setLives(3);
    setMultiplier(1);
    setGameState('playing');
    sound.playArcadeJump();
  };

  const pauseGame = () => {
    if (stateRef.current.state === 'playing') {
      stateRef.current.state = 'paused';
      setGameState('paused');
    } else if (stateRef.current.state === 'paused') {
      stateRef.current.state = 'playing';
      setGameState('playing');
    }
  };

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = true;

      if (e.code === 'Space' || e.code === 'Enter') {
        if (stateRef.current.state === 'title' || stateRef.current.state === 'gameover') {
          e.preventDefault();
          startGame();
        }
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        pauseGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      stateRef.current.keys[e.code] = false;
    };

    const handleBlur = () => {
      stateRef.current.keys = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // 60FPS Game Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const GOOD_TOKENS = ['{}', '=>', 'fn()', '&&', 'const', 'import', 'async', 'SQL', 'Git'];
    const BUG_TOKENS = ['null!', '404', 'NaN', 'OOM', 'ERR!'];

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05); // clamp delta time

      const s = stateRef.current;

      // Handle hitstop
      if (s.hitstop > 0) {
        s.hitstop -= dt;
      } else if (s.state === 'playing') {
        // Player input (WASD / Arrows)
        let moveDir = 0;
        if (s.keys['ArrowLeft'] || s.keys['KeyA']) moveDir -= 1;
        if (s.keys['ArrowRight'] || s.keys['KeyD']) moveDir += 1;

        s.player.vx = moveDir * s.player.speed;
        s.player.x += s.player.vx * dt;

        // Boundaries
        const minX = s.player.width / 2;
        const maxX = canvas.width - s.player.width / 2;
        if (s.player.x < minX) s.player.x = minX;
        if (s.player.x > maxX) s.player.x = maxX;

        // Token spawning
        s.spawnTimer += dt;
        const spawnInterval = Math.max(0.45, 1.2 - s.score * 0.002);
        if (s.spawnTimer > spawnInterval) {
          s.spawnTimer = 0;
          const isBug = Math.random() < 0.35;
          const text = isBug
            ? BUG_TOKENS[Math.floor(Math.random() * BUG_TOKENS.length)]
            : GOOD_TOKENS[Math.floor(Math.random() * GOOD_TOKENS.length)];

          s.tokens.push({
            id: Math.random(),
            x: Math.random() * (canvas.width - 80) + 40,
            y: -20,
            text,
            isBug,
            speed: 150 + Math.random() * 120 + s.score * 0.15,
            radius: 22,
            color: isBug ? '#ef4444' : '#6c4cf1',
          });
        }

        // Token updates & collisions
        for (let i = s.tokens.length - 1; i >= 0; i--) {
          const t = s.tokens[i];
          t.y += t.speed * dt;

          // Check collision with player
          const dx = t.x - s.player.x;
          const dy = t.y - s.player.y;
          const dist = Math.hypot(dx, dy);

          if (dist < t.radius + s.player.width / 2) {
            // Collision!
            if (t.isBug) {
              sound.playIncorrect();
              s.cameraShake = 0.3;
              s.hitstop = 0.07;
              s.lives -= 1;
              s.multiplier = 1;
              setLives(s.lives);
              setMultiplier(1);

              // Red particles
              for (let p = 0; p < 12; p++) {
                s.particles.push({
                  x: t.x,
                  y: t.y,
                  vx: (Math.random() - 0.5) * 280,
                  vy: (Math.random() - 0.5) * 280,
                  life: 0.35,
                  maxLife: 0.35,
                  color: '#ef4444',
                });
              }

              if (s.lives <= 0) {
                s.state = 'gameover';
                setGameState('gameover');
                if (s.score > highScore) {
                  setHighScore(s.score);
                  localStorage.setItem('codeks_arcade_highscore', String(s.score));
                }
              }
            } else {
              // Good token
              sound.playCorrect();
              const gain = 10 * s.multiplier;
              s.score += gain;
              s.multiplier = Math.min(5, s.multiplier + 1);
              setScore(s.score);
              setMultiplier(s.multiplier);

              // Sparkle particles
              for (let p = 0; p < 8; p++) {
                s.particles.push({
                  x: t.x,
                  y: t.y,
                  vx: (Math.random() - 0.5) * 200,
                  vy: (Math.random() - 0.5) * 200 - 60,
                  life: 0.4,
                  maxLife: 0.4,
                  color: '#ffd23f',
                });
              }
            }
            s.tokens.splice(i, 1);
            continue;
          }

          // Offscreen removal
          if (t.y > canvas.height + 40) {
            s.tokens.splice(i, 1);
          }
        }

        // Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) {
            s.particles.splice(i, 1);
          }
        }

        // Camera shake decay
        if (s.cameraShake > 0) {
          s.cameraShake = Math.max(0, s.cameraShake - dt * 2);
        }
      }

      // RENDER
      ctx.save();

      // Camera shake transform
      if (s.cameraShake > 0) {
        const shakeX = (Math.random() - 0.5) * s.cameraShake * 20;
        const shakeY = (Math.random() - 0.5) * s.cameraShake * 20;
        ctx.translate(shakeX, shakeY);
      }

      // Background - Memphis grid
      ctx.fillStyle = '#0f0c1b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle Memphis background grid lines
      ctx.strokeStyle = 'rgba(108, 76, 241, 0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Tokens
      for (const t of s.tokens) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fillStyle = t.isBug ? '#ef4444' : '#6c4cf1';
        ctx.shadowColor = t.isBug ? '#ef4444' : '#6c4cf1';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      }

      // Draw Particles
      for (const p of s.particles) {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw Player (Kodi Mascot in Cart / Runner form)
      ctx.save();
      const px = s.player.x;
      const py = s.player.y;

      // Cart Base
      ctx.fillStyle = '#ffd23f';
      ctx.beginPath();
      ctx.roundRect(px - 26, py + 10, 52, 16, 8);
      ctx.fill();
      ctx.strokeStyle = '#1e1b4b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Kodi Body Head
      ctx.fillStyle = '#6c4cf1';
      ctx.beginPath();
      ctx.arc(px, py - 4, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheeks
      ctx.fillStyle = '#ff7eb6';
      ctx.beginPath();
      ctx.arc(px - 10, py + 2, 4, 0, Math.PI * 2);
      ctx.arc(px + 10, py + 2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - 7, py - 6, 4, 0, Math.PI * 2);
      ctx.arc(px + 7, py - 6, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(px - 6, py - 6, 2, 0, Math.PI * 2);
      ctx.arc(px + 8, py - 6, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.restore();

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [highScore]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0f0c1b] text-white flex flex-col items-center justify-center select-none overflow-hidden font-sans">
      
      {/* Top Header Controls (Mute & Close) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleMute}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-[#ffd23f]" />}
        </button>
        <button
          onClick={onClose}
          className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-xs"
          title="Exit Arcade"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Low-Occlusion HUD Overlay (<15% screen coverage, pointer-events: none) */}
      {gameState === 'playing' && (
        <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
          {/* Left Stats Cluster */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-white/10">
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Score</p>
              <p className="text-xl font-black text-white tabular-nums">{score}</p>
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div>
              <p className="text-[10px] uppercase font-bold text-[#ffd23f]">Multiplier</p>
              <p className="text-xl font-black text-[#ffd23f] tabular-nums">x{multiplier}</p>
            </div>
          </div>

          {/* Right Lives Cluster */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xs px-5 py-2.5 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-gray-400">Shields:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((heart) => (
                <span
                  key={heart}
                  className={`w-3.5 h-3.5 rounded-full ${
                    heart <= lives ? 'bg-[#ff7eb6] shadow-sm shadow-[#ff7eb6]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Canvas Viewport (Fixed 800x560 virtual coordinate space) */}
      <canvas
        ref={canvasRef}
        width={800}
        height={560}
        className="w-full max-w-[800px] h-auto max-h-[560px] rounded-3xl border-2 border-[#6c4cf1]/30 shadow-2xl bg-[#0f0c1b]"
      />

      {/* Title Screen Overlay */}
      {gameState === 'title' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-[#0f0c1b]/80">
          {/* Bespoke inline SVG Title Lockup */}
          <div className="max-w-md w-full mb-4">
            <svg viewBox="0 0 400 110" className="w-full drop-shadow-lg">
              <rect x="10" y="10" width="380" height="90" rx="24" fill="#6c4cf1" />
              <circle cx="45" cy="55" r="22" fill="#ffd23f" />
              <polygon points="350,30 365,65 335,65" fill="#ff7eb6" />
              <text x="200" y="65" fill="#ffffff" fontSize="32" fontWeight="900" textAnchor="middle" letterSpacing="1">
                SYNTAX SPRINT
              </text>
              <text x="200" y="86" fill="#ffd23f" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="2">
                THE BUG CATCHER
              </text>
            </svg>
          </div>

          <p className="text-gray-300 text-sm max-w-sm mb-6 leading-relaxed">
            Dodge fatal bugs and collect valid syntax tokens to build your multiplier and set new high scores!
          </p>

          <button
            onClick={startGame}
            className="px-8 py-4 rounded-2xl bg-[#ffd23f] hover:bg-[#ffcd2b] text-[#78350f] font-black text-lg shadow-xl shadow-[#ffd23f]/20 hover:scale-105 active:scale-95 transition-all mb-4"
          >
            START SPRINT [Enter]
          </button>

          <p className="text-xs font-mono text-gray-400">
            A/D or ←/→ Move • Esc Pause • Space Action
          </p>

          {highScore > 0 && (
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-[#ffd23f] bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <Trophy className="w-4 h-4" />
              <span>Current Record: {highScore} pts</span>
            </div>
          )}
        </div>
      )}

      {/* Pause Modal Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/75">
          <h2 className="text-3xl font-black text-white mb-2">SPRINT PAUSED</h2>
          <p className="text-gray-400 text-sm mb-6">Take a breath. Kodi is waiting at the terminal.</p>
          <button
            onClick={pauseGame}
            className="px-6 py-3 rounded-2xl bg-[#6c4cf1] hover:bg-[#5839e6] text-white font-extrabold text-sm shadow-md transition-all mb-3"
          >
            Resume Sprint [Esc]
          </button>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Return to Academy
          </button>
        </div>
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-black/85">
          <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-2xl font-black mb-3">
            !
          </div>
          <h2 className="text-3xl font-black text-white mb-1">SYNTAX CRASH!</h2>
          <p className="text-gray-400 text-sm mb-4">You were caught by a fatal null pointer bug.</p>

          <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/15 mb-6">
            <span className="text-xs text-gray-400 uppercase font-bold block">Final Sprint Score</span>
            <span className="text-3xl font-black text-[#ffd23f] tabular-nums">{score}</span>
          </div>

          <button
            onClick={startGame}
            className="px-8 py-3.5 rounded-2xl bg-[#ffd23f] hover:bg-[#ffcd2b] text-[#78350f] font-black text-base shadow-lg transition-all active:scale-95 mb-3"
          >
            PLAY AGAIN [Space]
          </button>
          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Exit to Academy
          </button>
        </div>
      )}

    </div>
  );
};
