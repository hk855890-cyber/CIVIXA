import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ArrowRight, Camera, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { useReports } from '../../context/ReportsContext';

interface CharacterHeroSceneProps {
  onContinueToLogin: () => void;
  onExploreHowItWorks?: () => void;
}

export const CharacterHeroScene: React.FC<CharacterHeroSceneProps> = ({
  onContinueToLogin,
  onExploreHowItWorks,
}) => {
  const { setCapturedHeroPhoto } = useReports();

  // Animation Sequence:
  // 1. 'walking' -> natural reference-matched walk towards center (approx 4.2s)
  // 2. 'stopping' -> deceleration into natural standing pose (0.6s)
  // 3. 'noticing' -> turning gaze and gesturing towards the pothole (1.2s)
  // 4. 'aiming' -> raising smartphone & aiming with focus reticle (1.4s)
  // 5. 'snapping' -> shutter flash (0.3s)
  // 6. 'captured' -> confirmation card shown
  const [phase, setPhase] = useState<
    'walking' | 'stopping' | 'noticing' | 'aiming' | 'snapping' | 'captured'
  >('walking');

  const [characterX, setCharacterX] = useState(12); // Percentage from left (starts on left)
  const [walkPhaseAngle, setWalkPhaseAngle] = useState(0); // Leg/arm kinematics angle
  const [characterTurn, setCharacterTurn] = useState(0.85);
  const [flashEffect, setFlashEffect] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const potholePhotoUrl =
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80';

  // REFERENCE-MATCHED WALK PHYSICS ENGINE
  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;
    const startX = 10;
    const targetX = 43;
    const walkDuration = 4200; // 4.2 seconds casual walk

    const animateWalk = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / walkDuration, 1);

      // Smooth deceleration near target
      const smoothProgress = progress < 0.85
        ? (progress / 0.85) * 0.85
        : 0.85 + (1 - Math.pow(1 - (progress - 0.85) / 0.15, 2)) * 0.15;

      const currentX = startX + (targetX - startX) * smoothProgress;
      setCharacterX(currentX);

      // Walking cadence
      const stepCadence = (elapsed / 1000) * 1.75 * Math.PI;
      setWalkPhaseAngle(stepCadence);

      if (progress > 0.75) {
        const turnProgress = (progress - 0.75) / 0.25;
        setCharacterTurn(0.85 * (1 - turnProgress));
      } else {
        setCharacterTurn(0.85);
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animateWalk);
      } else {
        setPhase('stopping');
        setTimeout(() => {
          setPhase('noticing');
        }, 600);
      }
    };

    animationFrameId = requestAnimationFrame(animateWalk);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Post-arrival choreography: noticing -> aiming -> snapping -> captured
  useEffect(() => {
    if (phase === 'noticing') {
      const t1 = setTimeout(() => {
        setPhase('aiming');
      }, 1200);
      return () => clearTimeout(t1);
    }

    if (phase === 'aiming') {
      const t2 = setTimeout(() => {
        setPhase('snapping');
        setFlashEffect(true);
        setTimeout(() => setFlashEffect(false), 300);

        setCapturedHeroPhoto(potholePhotoUrl);

        setTimeout(() => {
          setPhase('captured');
        }, 450);
      }, 1400);
      return () => clearTimeout(t2);
    }
  }, [phase, setCapturedHeroPhoto]);

  // KINEMATIC FORMULAS
  const isWalking = phase === 'walking';
  const isStopping = phase === 'stopping';

  // Walk cycle angles for legs
  const hipSwingLeft = isWalking
    ? Math.sin(walkPhaseAngle) * 18
    : isStopping
    ? Math.sin(walkPhaseAngle) * 5
    : 2;

  const hipSwingRight = isWalking
    ? -Math.sin(walkPhaseAngle) * 18
    : isStopping
    ? -Math.sin(walkPhaseAngle) * 5
    : -2;

  const kneeFlexLeft = isWalking
    ? Math.max(0, -Math.cos(walkPhaseAngle) * 26 + 4)
    : 3;

  const kneeFlexRight = isWalking
    ? Math.max(0, Math.cos(walkPhaseAngle) * 26 + 4)
    : 3;

  const footAngleLeft = isWalking
    ? Math.sin(walkPhaseAngle) * 10
    : 0;

  const footAngleRight = isWalking
    ? -Math.sin(walkPhaseAngle) * 10
    : 0;

  // PERFECTLY ALIGNED ARM & HAND KINEMATICS
  // Left arm swing
  const armSwingLeft = isWalking
    ? -Math.sin(walkPhaseAngle) * 16
    : phase === 'noticing'
    ? -8
    : phase === 'aiming' || phase === 'snapping' || phase === 'captured'
    ? -32
    : 4;

  const forearmAngleLeft = isWalking
    ? 14
    : phase === 'noticing'
    ? 25
    : phase === 'aiming' || phase === 'snapping' || phase === 'captured'
    ? 45
    : 10;

  // Right arm swing (raising smartphone with seamless wrist-hand alignment)
  const armSwingRight = isWalking
    ? Math.sin(walkPhaseAngle) * 16
    : phase === 'noticing'
    ? 15
    : phase === 'aiming' || phase === 'snapping' || phase === 'captured'
    ? -58
    : 6;

  const forearmAngleRight = isWalking
    ? 20
    : phase === 'noticing'
    ? 40
    : phase === 'aiming' || phase === 'snapping' || phase === 'captured'
    ? 82
    : 18;

  const bodyBob = isWalking ? Math.abs(Math.sin(walkPhaseAngle)) * 3.5 : 0;
  const bodySway = isWalking ? Math.sin(walkPhaseAngle) * 1.5 : 0;

  const headAngle =
    phase === 'noticing'
      ? 12
      : phase === 'aiming' || phase === 'snapping' || phase === 'captured'
      ? 14
      : 0;

  return (
    <div
      ref={containerRef}
      id="hero-visual-stage"
      className="relative w-full h-[460px] md:h-[500px] lg:h-[540px] bg-gradient-to-b from-sky-50/70 via-slate-50 to-emerald-50/30 rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-end"
    >
      {/* Background Environment (Clean City Street & Sidewalk) */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Soft atmospheric gradient */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-100/40 to-transparent" />

        {/* Distant clean city skyline silhouette */}
        <svg
          className="absolute bottom-32 inset-x-0 w-full h-24 text-slate-200/60"
          preserveAspectRatio="none"
          viewBox="0 0 800 120"
        >
          <path
            fill="currentColor"
            d="M0,120 L0,95 L40,95 L40,65 L80,65 L80,95 L130,95 L130,45 L170,45 L170,95 L240,95 L240,75 L280,75 L280,95 L360,95 L360,35 L400,35 L400,95 L460,95 L460,60 L500,60 L500,95 L580,95 L580,50 L630,50 L630,95 L720,95 L720,70 L760,70 L760,95 L800,95 L800,120 Z"
          />
        </svg>

        {/* Street lamp on sidewalk */}
        <div className="absolute bottom-28 left-8 opacity-40">
          <div className="w-1.5 h-36 bg-slate-400 mx-auto rounded-t" />
          <div className="w-8 h-2 bg-slate-500 rounded-full -mt-36" />
          <div className="w-3 h-3 bg-amber-200 rounded-full mx-auto shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Asphalt Road & Sidewalk Curb */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 border-t-4 border-slate-600">
          {/* Sidewalk curb */}
          <div className="absolute -top-3 inset-x-0 h-3 bg-slate-300 border-b border-slate-400 flex items-center">
            <div className="w-full border-t border-dashed border-slate-400 opacity-60" />
          </div>

          {/* Road center dash markings */}
          <div className="absolute top-16 inset-x-0 flex justify-between px-4 opacity-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-12 h-1.5 bg-amber-400 rounded-sm" />
            ))}
          </div>
        </div>

        {/* Civic Issue on Road: Realistic Damaged Road Pothole */}
        <div
          id="civic-pothole-target"
          className="absolute bottom-10 left-[64%] -translate-x-1/2 w-48 md:w-56 z-10"
        >
          <div className="relative">
            {/* Crater depth */}
            <div className="w-44 md:w-52 h-14 bg-stone-950/90 rounded-[50%] border-2 border-stone-800 shadow-inner overflow-hidden relative">
              <div className="absolute inset-2 bg-stone-900 rounded-[50%] opacity-90">
                <div className="absolute top-2 left-4 w-6 h-3 bg-stone-800 rounded-full" />
                <div className="absolute bottom-2 right-6 w-8 h-4 bg-stone-800 rounded-full" />
                <div className="absolute top-3 right-12 w-4 h-2 bg-amber-950/40 rounded-sm" />
              </div>
              <svg className="absolute inset-0 w-full h-full text-stone-700/80" viewBox="0 0 200 60">
                <path d="M10,30 L40,28 L60,35 L90,25 L130,32 L180,26" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M40,28 L50,15 M90,25 L105,45 M130,32 L145,18" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
            </div>

            {/* Pulsing indicator tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-full shadow-md border border-red-200 text-xs font-semibold text-slate-800 whitespace-nowrap"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <AlertCircle className="w-3.5 h-3.5 text-red-500" />
              <span>Damaged Road Asphalt</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3D CHARACTER RIG WITH ACCURATE HAND-WRIST-SHOULDER ALIGNMENT */}
      <div
        id="hero-character-agent"
        style={{
          left: `${characterX}%`,
          transform: `translateX(-50%) translateY(${-bodyBob}px) rotate(${bodySway}deg)`,
        }}
        className="absolute bottom-20 z-20 select-none pointer-events-none transition-transform duration-75 ease-out"
      >
        {/* Ground Contact Shadow */}
        <div
          style={{
            transform: `scale(${1 - bodyBob * 0.04})`,
          }}
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900/35 rounded-full blur-[3px]"
        />

        {/* Rig Container (200px width x 340px height) */}
        <div className="relative w-50 h-86 flex flex-col items-center">

          {/* HEAD & FACIAL EXPRESSION */}
          <div
            style={{
              transform: `rotate(${headAngle}deg)`,
              transformOrigin: 'bottom center',
            }}
            className="relative z-30 flex flex-col items-center transition-transform duration-300"
          >
            {/* Textured Dark Brown Voluminous Hair with Side Swoop & Tuft Strands */}
            <div className="relative w-20 h-15 -mb-5 z-10">
              <div className="w-20 h-12 bg-[#4a2e1b] rounded-t-[30px] rounded-b-lg shadow-md transform -rotate-1" />
              <div className="absolute -top-3 left-1.5 w-14 h-8 bg-[#5c3a21] rounded-t-full shadow-inner transform -rotate-3" />
              <div className="absolute -top-2.5 right-1 w-9 h-7 bg-[#3d2414] rounded-t-full" />
              <div className="absolute -top-1.5 left-4 w-9 h-3.5 bg-[#6d4629] rounded-full blur-[0.4px]" />
              <div className="absolute top-2 left-1 w-4 h-6 bg-[#5c3a21] rounded-l-full" />
              <div className="absolute top-1 right-0.5 w-4 h-7 bg-[#3d2414] rounded-r-full" />
            </div>

            {/* 3D Head Base */}
            <div className="w-14 h-16 bg-[#fcd5b8] rounded-2xl border border-[#eabfa0] shadow-md flex flex-col items-center pt-2.5 relative">
              {/* Ears */}
              <div className="absolute -left-2 top-5 w-2.5 h-5 bg-[#f5caa9] rounded-l-full shadow-inner" />
              <div className="absolute -right-2 top-5 w-2.5 h-5 bg-[#f5caa9] rounded-r-full shadow-inner" />

              {/* Expressive Arched Eyebrows */}
              <div className="flex justify-between w-10 px-0.5">
                <div className="w-3.5 h-1 bg-[#3d2414] rounded-full transform -rotate-3" />
                <div className="w-3.5 h-1 bg-[#3d2414] rounded-full transform rotate-3" />
              </div>

              {/* Big Expressive Eyes */}
              <div className="flex justify-between w-9.5 px-0.5 mt-1">
                <div className="w-3 h-3.5 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="w-2 h-2.2 bg-[#54341b] rounded-full flex items-center justify-center">
                    <div className="w-1.2 h-1.2 bg-black rounded-full" />
                  </div>
                  <div className="w-0.8 h-0.8 bg-white rounded-full absolute top-0.5 right-0.5 shadow-xs" />
                  <div className="w-0.4 h-0.4 bg-white/80 rounded-full absolute bottom-0.8 left-0.8" />
                </div>
                <div className="w-3 h-3.5 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                  <div className="w-2 h-2.2 bg-[#54341b] rounded-full flex items-center justify-center">
                    <div className="w-1.2 h-1.2 bg-black rounded-full" />
                  </div>
                  <div className="w-0.8 h-0.8 bg-white rounded-full absolute top-0.5 right-0.5 shadow-xs" />
                  <div className="w-0.4 h-0.4 bg-white/80 rounded-full absolute bottom-0.8 left-0.8" />
                </div>
              </div>

              {/* Sculpted Nose */}
              <div className="w-2 h-2.5 bg-[#eebf9e] rounded-full mt-0.5 shadow-2xs" />

              {/* Friendly Confident Smile */}
              <div className="w-5.5 h-3 border-b-2.5 border-[#4a2e1b] rounded-b-full mt-0.5 bg-rose-900/10" />
            </div>

            {/* Neck */}
            <div className="w-6 h-3.5 bg-[#f5caa9] -mt-0.5 shadow-inner" />
          </div>

          {/* TORSO & SHOULDERS */}
          <div className="relative z-20 w-24 h-28 flex justify-center -mt-0.5">
            {/* White Inner Shirt with central placket */}
            <div className="w-11 h-26 bg-white rounded-t-lg rounded-b-xs shadow-inner flex flex-col items-center pt-1 border border-slate-200">
              <div className="w-4 h-2 border-b border-slate-300 rounded-b-md" />
              <div className="w-1.5 h-20 bg-amber-700/60 rounded-xs mt-1 flex flex-col items-center justify-evenly">
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Open Orange/Terracotta Overshirt (Left Flap) */}
            <div className="absolute left-0 top-0 w-8 h-26 bg-gradient-to-br from-[#ea580c] via-[#c2410c] to-[#9a3412] rounded-tl-2xl rounded-bl-lg shadow-md border-t border-l border-orange-400 flex flex-col p-1">
              <div className="w-6 h-3 bg-[#f97316] rounded-tl-lg transform -rotate-12 border-b border-orange-800/40 shadow-xs" />
              <div className="w-5.5 h-6 bg-[#c2410c] border border-orange-400/40 rounded-sm mt-3 shadow-inner flex flex-col items-center pt-0.5">
                <div className="w-5 h-1.5 bg-[#ea580c] rounded-t-xs" />
                <div className="w-1 h-1 bg-amber-200 rounded-full mt-1" />
              </div>
            </div>

            {/* Open Orange/Terracotta Overshirt (Right Flap) */}
            <div className="absolute right-0 top-0 w-8 h-26 bg-gradient-to-bl from-[#ea580c] via-[#c2410c] to-[#9a3412] rounded-tr-2xl rounded-br-lg shadow-md border-t border-r border-orange-400 flex flex-col p-1 items-end">
              <div className="w-6 h-3 bg-[#f97316] rounded-tr-lg transform rotate-12 border-b border-orange-800/40 shadow-xs" />
              <div className="w-5.5 h-6 bg-[#c2410c] border border-orange-400/40 rounded-sm mt-3 shadow-inner flex flex-col items-center pt-0.5">
                <div className="w-5 h-1.5 bg-[#ea580c] rounded-t-xs" />
                <div className="w-1 h-1 bg-amber-200 rounded-full mt-1" />
              </div>
            </div>

            {/* Dark Belt with Silver Buckle */}
            <div className="absolute bottom-0 inset-x-2 h-2.5 bg-[#1c1917] rounded-xs shadow-md flex items-center justify-center border-t border-stone-800">
              <div className="w-4 h-2.5 bg-slate-300 border border-slate-500 rounded-xs flex items-center justify-center">
                <div className="w-2 h-1 bg-[#1c1917]" />
              </div>
            </div>
          </div>

          {/* LEFT ARM RIG (Attached accurately to Left Shoulder Socket) */}
          <div
            style={{
              position: 'absolute',
              top: '72px',
              left: '38px',
              transform: `rotate(${armSwingLeft}deg)`,
              transformOrigin: '10px 6px',
            }}
            className="z-15 transition-transform duration-75"
          >
            {/* Shoulder Ball & Upper Sleeve */}
            <div className="w-5.5 h-12 bg-gradient-to-b from-[#ea580c] to-[#c2410c] rounded-t-full rounded-b-md shadow-sm border border-orange-400/40 relative">
              {/* Sleeve cuff seam */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#9a3412] rounded-b-md" />
            </div>

            {/* Left Forearm Joint (Pivoting from Elbow) */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '0.5px',
                transform: `rotate(${forearmAngleLeft}deg)`,
                transformOrigin: '2.5px 4px',
              }}
              className="flex flex-col items-center"
            >
              {/* Forearm Sleeve */}
              <div className="w-4.5 h-11 bg-gradient-to-b from-[#c2410c] to-[#9a3412] rounded-md shadow-sm border-t border-orange-500/30" />
              
              {/* Wrist Cuff */}
              <div className="w-4 h-1 bg-[#7c2d12] rounded-xs -mt-0.5" />

              {/* Hand & Sculpted Fingers (Seamlessly jointed to wrist) */}
              <div className="w-4.5 h-5 bg-[#fcd5b8] border border-[#eabfa0] rounded-b-xl rounded-t-xs shadow-xs relative flex items-center justify-center -mt-0.5">
                {/* Thumb knuckle definition */}
                <div className="absolute -left-1 top-1 w-1.5 h-2.5 bg-[#f5caa9] rounded-l-full shadow-2xs" />
                {/* Finger curl grooves */}
                <div className="w-3 h-2 border-b border-[#e5a882] rounded-b-sm opacity-60" />
              </div>
            </div>
          </div>

          {/* RIGHT ARM RIG (Attached accurately to Right Shoulder Socket & Firmly Gripping Smartphone) */}
          <div
            style={{
              position: 'absolute',
              top: '72px',
              right: '38px',
              transform: `rotate(${armSwingRight}deg)`,
              transformOrigin: '12px 6px',
            }}
            className="z-25 transition-transform duration-75"
          >
            {/* Shoulder Ball & Upper Sleeve */}
            <div className="w-5.5 h-12 bg-gradient-to-b from-[#ea580c] to-[#c2410c] rounded-t-full rounded-b-md shadow-sm border border-orange-400/40 relative">
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#9a3412] rounded-b-md" />
            </div>

            {/* Right Forearm Joint (Pivoting from Elbow) */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '0.5px',
                transform: `rotate(${forearmAngleRight}deg)`,
                transformOrigin: '2.5px 4px',
              }}
              className="relative flex flex-col items-center"
            >
              {/* Forearm Sleeve */}
              <div className="w-4.5 h-11 bg-gradient-to-b from-[#c2410c] to-[#9a3412] rounded-md shadow-sm border-t border-orange-500/30" />
              
              {/* Wrist Cuff */}
              <div className="w-4 h-1 bg-[#7c2d12] rounded-xs -mt-0.5" />

              {/* Hand Rig Firmly Clamping Smartphone with Fingers & Thumb */}
              <div className="relative -mt-0.5">
                {/* Palm Base */}
                <div className="w-5 h-5 bg-[#fcd5b8] border border-[#eabfa0] rounded-b-lg rounded-t-xs shadow-xs relative">
                  {/* Thumb Wrapping Around Front */}
                  <div className="absolute -left-1.5 top-0.5 w-2 h-3.5 bg-[#f5caa9] rounded-l-full shadow-xs z-30" />
                  
                  {/* Front Fingers Gripping Phone Bezel */}
                  <div className="absolute -right-1 top-1 w-2.5 h-4 flex flex-col justify-between z-30">
                    <div className="w-2.5 h-1 bg-[#fcd5b8] rounded-r-full shadow-2xs" />
                    <div className="w-2.5 h-1 bg-[#fcd5b8] rounded-r-full shadow-2xs" />
                    <div className="w-2.5 h-1 bg-[#fcd5b8] rounded-r-full shadow-2xs" />
                  </div>
                </div>

                {/* Sleek Modern Smartphone Clamped Securely in Hand */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-4px',
                    transform: 'rotate(12deg)',
                  }}
                  className="w-7 h-13 bg-[#18181b] rounded-md p-0.5 border border-slate-700 shadow-xl z-20"
                >
                  <div className="w-full h-full bg-[#27272a] rounded-sm flex flex-col items-center justify-between p-0.5 relative overflow-hidden">
                    {/* Triple Camera Module */}
                    <div className="w-3 h-3 bg-black rounded-xs self-start m-0.5 p-0.5 grid grid-cols-2 gap-0.5">
                      <div className="w-0.8 h-0.8 bg-slate-400 rounded-full" />
                      <div className="w-0.8 h-0.8 bg-slate-400 rounded-full" />
                      <div className="w-0.8 h-0.8 bg-slate-400 rounded-full" />
                    </div>

                    {/* Viewfinder display during aiming */}
                    {(phase === 'aiming' || phase === 'snapping' || phase === 'captured') && (
                      <div className="w-4.5 h-5 border border-emerald-400 border-dashed rounded-xs flex items-center justify-center bg-emerald-950/40">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                      </div>
                    )}
                    <div className="w-2 h-0.5 bg-slate-500 rounded-full mb-0.5" />
                  </div>
                </div>

                {/* Aiming focus laser guideline emitted from camera */}
                {phase === 'aiming' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.9, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="absolute top-2 left-6 w-32 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent rotate-[28deg] origin-left z-50 pointer-events-none"
                  />
                )}
              </div>
            </div>
          </div>

          {/* LEGS & SHOES: DARK CHARCOAL SLIM TROUSERS & RUST/ORANGE SNEAKERS */}
          <div className="relative z-10 w-20 h-36 flex justify-between px-1 -mt-1">
            {/* Left Leg (Thigh + Shin + Orange Sneaker) */}
            <div
              style={{
                transform: `rotate(${hipSwingLeft}deg)`,
                transformOrigin: 'top center',
              }}
              className="w-7 flex flex-col items-center transition-transform duration-75"
            >
              <div className="w-6.5 h-17 bg-gradient-to-b from-[#292524] to-[#1c1917] rounded-t-sm shadow-inner" />

              {/* Lower Knee & Shin */}
              <div
                style={{
                  transform: `rotate(${kneeFlexLeft}deg)`,
                  transformOrigin: 'top center',
                }}
                className="w-6.5 flex flex-col items-center -mt-1"
              >
                <div className="w-6 h-17 bg-gradient-to-b from-[#1c1917] to-[#0c0a09] rounded-b-xs shadow-md" />

                {/* Orange/Rust Low-top Sneaker with White Sole & Laces */}
                <div
                  style={{
                    transform: `rotate(${footAngleLeft}deg)`,
                    transformOrigin: 'top left',
                  }}
                  className="w-9.5 h-4.5 bg-[#ea580c] rounded-r-xl rounded-l-md shadow-md -ml-2 -mt-0.5 border-t border-orange-400 relative flex flex-col justify-between"
                >
                  <div className="flex gap-0.5 px-2 pt-0.5">
                    <div className="w-1 h-0.5 bg-white rounded-full" />
                    <div className="w-1 h-0.5 bg-white rounded-full" />
                    <div className="w-1 h-0.5 bg-white rounded-full" />
                  </div>
                  <div className="h-1.5 bg-white rounded-b-md border-t border-slate-300 w-full" />
                </div>
              </div>
            </div>

            {/* Right Leg (Thigh + Shin + Orange Sneaker) */}
            <div
              style={{
                transform: `rotate(${hipSwingRight}deg)`,
                transformOrigin: 'top center',
              }}
              className="w-7 flex flex-col items-center transition-transform duration-75"
            >
              <div className="w-6.5 h-17 bg-gradient-to-b from-[#292524] to-[#1c1917] rounded-t-sm shadow-inner" />

              {/* Lower Knee & Shin */}
              <div
                style={{
                  transform: `rotate(${kneeFlexRight}deg)`,
                  transformOrigin: 'top center',
                }}
                className="w-6.5 flex flex-col items-center -mt-1"
              >
                <div className="w-6 h-17 bg-gradient-to-b from-[#1c1917] to-[#0c0a09] rounded-b-xs shadow-md" />

                {/* Orange/Rust Low-top Sneaker with White Sole & Laces */}
                <div
                  style={{
                    transform: `rotate(${footAngleRight}deg)`,
                    transformOrigin: 'top left',
                  }}
                  className="w-9.5 h-4.5 bg-[#ea580c] rounded-r-xl rounded-l-md shadow-md -ml-2 -mt-0.5 border-t border-orange-400 relative flex flex-col justify-between"
                >
                  <div className="flex gap-0.5 px-2 pt-0.5">
                    <div className="w-1 h-0.5 bg-white rounded-full" />
                    <div className="w-1 h-0.5 bg-white rounded-full" />
                    <div className="w-1 h-0.5 bg-white rounded-full" />
                  </div>
                  <div className="h-1.5 bg-white rounded-b-md border-t border-slate-300 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAMERA SHUTTER OPTICAL FLASH EFFECT */}
      <AnimatePresence>
        {flashEffect && (
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* PHOTO CAPTURED CONFIRMATION CARD */}
      <AnimatePresence>
        {phase === 'captured' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            id="photo-captured-confirmation-card"
            className="absolute top-6 right-6 md:top-8 md:right-8 z-40 max-w-sm w-full bg-white/98 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-emerald-100 ring-1 ring-slate-900/5"
          >
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-lg mb-1.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
              <span>Photo Captured ✓</span>
            </div>

            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Your civic issue has been successfully photographed.
            </p>

            <div className="relative rounded-xl overflow-hidden mb-4 border border-slate-200 shadow-sm aspect-video bg-slate-900 group">
              <img
                src={potholePhotoUrl}
                alt="Captured Road Damage"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/75 backdrop-blur-xs rounded-md text-[11px] font-medium text-white flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Gandhipuram, Coimbatore</span>
              </div>
            </div>

            <button
              id="hero-continue-to-login-btn"
              onClick={onContinueToLogin}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Continue to Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
