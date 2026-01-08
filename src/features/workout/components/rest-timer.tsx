"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESETS = [60, 90, 120] as const;

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function RestTimer() {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(90);
  const [isFinished, setIsFinished] = useState(false);

  // Create beep sound using Web Audio API
  const playBeep = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Silently fail if audio is not supported
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, playBeep]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
      setIsFinished(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setIsFinished(false);
  };

  const handlePreset = (seconds: number) => {
    setIsRunning(false);
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsFinished(false);
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 transition-colors",
        isFinished && "border-green-500 bg-green-500/10"
      )}
    >
      <div className="flex items-center gap-2 mb-3">
        <Timer className="size-4" />
        <span className="text-sm font-medium">Rest Timer</span>
      </div>

      <div
        className={cn(
          "text-4xl font-mono font-bold text-center mb-4 tabular-nums",
          isFinished && "text-green-500"
        )}
      >
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-2 justify-center mb-3">
        {!isRunning ? (
          <Button onClick={handleStart} size="sm" variant="default">
            <Play className="size-4" />
            {timeLeft === 0 ? "Restart" : "Start"}
          </Button>
        ) : (
          <Button onClick={handlePause} size="sm" variant="secondary">
            <Pause className="size-4" />
            Pause
          </Button>
        )}
        <Button onClick={handleReset} size="sm" variant="outline">
          <RotateCcw className="size-4" />
          Reset
        </Button>
      </div>

      <div className="flex gap-2 justify-center">
        {PRESETS.map((preset) => (
          <Button
            key={preset}
            onClick={() => handlePreset(preset)}
            size="sm"
            variant={initialTime === preset ? "secondary" : "ghost"}
            className="text-xs"
          >
            {preset}s
          </Button>
        ))}
      </div>
    </div>
  );
}
