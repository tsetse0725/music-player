"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { RepeatMode, Track } from "./types";
import PlayerHeader from "./PlayerHeader";
import AudioElement from "./AudioElement";
import ProgressBar from "./ProgressBar";
import PlayerControls from "./PlayerControls";
import Playlist from "./Playlist";
import VolumeControl from "./VolumeControl";
import Equalizer from "./Equalizer";

const tracks: Track[] = [
  {
    id: 1,
    title: "Champagne Supernova",
    artist: "Oasis",
    src: "/audio/champagne-supernova.mp3",
  },
  {
    id: 2,
    title: "Runaway",
    artist: "AURORA",
    src: "/audio/AURORA-Runaway.mp3",
  },
  {
    id: 3,
    title: "Bug a boo",
    artist: "Minelli",
    src: "/audio/Minelli-Bug a Boo.mp3",
  },
  {
    id: 4,
    title: "MMM",
    artist: "Minelli",
    src: "/audio/Minelli-MMM.mp3",
  },
  {
    id: 5,
    title: "Nothing Hurts",
    artist: "Minelli",
    src: "/audio/Minelli-Nothing Hurts.mp3",
  },
  {
    id: 6,
    title: "Rampampam",
    artist: "Minelli",
    src: "/audio/Minelli-Rampampam.mp3",
  },
];

const TRACK_COUNT = tracks.length;

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off");

  
  const [volume, setVolume] = useState(1); 
  const [isMuted, setIsMuted] = useState(false);

  
  const [eq, setEq] = useState({ bass: 0, mid: 0, treble: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentIndex];

  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastAudioElRef = useRef<HTMLAudioElement | null>(null);

  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassRef = useRef<BiquadFilterNode | null>(null);
  const midRef = useRef<BiquadFilterNode | null>(null);
  const trebleRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const disconnectGraph = () => {
    try {
      sourceRef.current?.disconnect();
    } catch {}
    try {
      bassRef.current?.disconnect();
    } catch {}
    try {
      midRef.current?.disconnect();
    } catch {}
    try {
      trebleRef.current?.disconnect();
    } catch {}
    try {
      gainRef.current?.disconnect();
    } catch {}

    sourceRef.current = null;
    bassRef.current = null;
    midRef.current = null;
    trebleRef.current = null;
    gainRef.current = null;
  };

  const ensureAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  };

  const setupAudioGraphForCurrentAudioEl = useCallback(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const ctx = ensureAudioContext();

    
    if (lastAudioElRef.current !== audioEl) {
      disconnectGraph();


      const source = ctx.createMediaElementSource(audioEl);

      const bass = ctx.createBiquadFilter();
      bass.type = "lowshelf";
      bass.frequency.value = 120;

      const mid = ctx.createBiquadFilter();
      mid.type = "peaking";
      mid.frequency.value = 1000;
      mid.Q.value = 1;

      const treble = ctx.createBiquadFilter();
      treble.type = "highshelf";
      treble.frequency.value = 6000;

      const gain = ctx.createGain();

      
      source.connect(bass);
      bass.connect(mid);
      mid.connect(treble);
      treble.connect(gain);
      gain.connect(ctx.destination);

      sourceRef.current = source;
      bassRef.current = bass;
      midRef.current = mid;
      trebleRef.current = treble;
      gainRef.current = gain;

      lastAudioElRef.current = audioEl;
    }

    
    if (bassRef.current) bassRef.current.gain.value = eq.bass;
    if (midRef.current) midRef.current.gain.value = eq.mid;
    if (trebleRef.current) trebleRef.current.gain.value = eq.treble;
    if (gainRef.current) gainRef.current.gain.value = isMuted ? 0 : volume;
  }, [eq.bass, eq.mid, eq.treble, isMuted, volume]);

  
useEffect(() => {
  setupAudioGraphForCurrentAudioEl();
}, [currentIndex, setupAudioGraphForCurrentAudioEl]);

  
  useEffect(() => {
    if (bassRef.current) bassRef.current.gain.value = eq.bass;
    if (midRef.current) midRef.current.gain.value = eq.mid;
    if (trebleRef.current) trebleRef.current.gain.value = eq.treble;
  }, [eq]);

  
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  
  const setTrack = useCallback(
    (index: number, shouldPlay: boolean) => {
      setCurrentIndex(index);
      setCurrentTime(0);
      setDuration(0);

      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;

      setIsPlaying(shouldPlay);
    },
    []
  );

  const pickRandomDifferentIndex = (from: number) => {
    if (TRACK_COUNT <= 1) return from;
    let next = from;
    while (next === from) next = Math.floor(Math.random() * TRACK_COUNT);
    return next;
  };

  const handleSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const handlePrev = useCallback(() => {
    if (shuffle) {
      const prev = pickRandomDifferentIndex(currentIndex);
      setTrack(prev, true);
      return;
    }

    const prev = currentIndex === 0 ? TRACK_COUNT - 1 : currentIndex - 1;
    setTrack(prev, true);
  }, [currentIndex, shuffle, setTrack]);

  const handleNext = useCallback(() => {
    if (repeatMode === "one") {
      setIsPlaying(true);
      return;
    }

    if (shuffle) {
      const next = pickRandomDifferentIndex(currentIndex);
      setTrack(next, true);
      return;
    }

    if (repeatMode === "all") {
      const next = (currentIndex + 1) % TRACK_COUNT;
      setTrack(next, true);
      return;
    }

    if (currentIndex === TRACK_COUNT - 1) {
      setIsPlaying(false);
      return;
    }

    setTrack(currentIndex + 1, true);
  }, [currentIndex, repeatMode, shuffle, setTrack]);

  const handlePlayPause = () => setIsPlaying((p) => !p);

  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentIndex]);

  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      if (!duration && Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      if (shuffle) {
        const next = pickRandomDifferentIndex(currentIndex);
        setTrack(next, true);
        return;
      }

      if (repeatMode === "all") {
        const next = (currentIndex + 1) % TRACK_COUNT;
        setTrack(next, true);
        return;
      }

      if (currentIndex === TRACK_COUNT - 1) {
        setIsPlaying(false);
        return;
      }

      setTrack(currentIndex + 1, true);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, duration, repeatMode, shuffle, setTrack]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-[420px] p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl text-white shadow-xl border border-white/10">
        <PlayerHeader title={currentTrack.title} artist={currentTrack.artist} />

        <AudioElement
          audioRef={audioRef}
          src={currentTrack.src}
          onLoaded={(d) => setDuration(d)}
        />

        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
        />

        <PlayerControls
          isPlaying={isPlaying}
          shuffle={shuffle}
          repeatMode={repeatMode}
          onPlayPause={() => {
            
            setupAudioGraphForCurrentAudioEl();
            handlePlayPause();
          }}
          onPrev={handlePrev}
          onNext={handleNext}
          onShuffle={() => setShuffle((p) => !p)}
          onRepeat={() =>
            setRepeatMode((p) =>
              p === "off" ? "all" : p === "all" ? "one" : "off"
            )
          }
        />

        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((p) => !p)}
          onVolumeChange={(v) => {
            setVolume(v);
            if (v > 0 && isMuted) setIsMuted(false);
          }}
        />

        <Equalizer
          bass={eq.bass}
          mid={eq.mid}
          treble={eq.treble}
          onChange={setEq}
          onReset={() => setEq({ bass: 0, mid: 0, treble: 0 })}
        />

        <Playlist
          tracks={tracks}
          currentIndex={currentIndex}
          onSelect={(index) => setTrack(index, true)}
        />
      </div>
    </div>
  );
}
