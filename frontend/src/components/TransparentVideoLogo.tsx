'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface TransparentVideoLogoProps {
  className?: string;
  showText?: boolean;
}

export default function TransparentVideoLogo({ className = '', showText = true }: TransparentVideoLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let animId: number;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const setupCanvas = () => {
      const vWidth = video.videoWidth || 640;
      const vHeight = video.videoHeight || 360;
      canvas.width = 480;
      canvas.height = Math.round((vHeight / vWidth) * 480);
      setIsReady(true);
    };

    video.addEventListener('loadedmetadata', setupCanvas);
    if (video.readyState >= 1) setupCanvas();

    const renderFrame = () => {
      if (video.readyState >= 2 && ctx && canvas.width > 0) {
        const w = canvas.width;
        const h = canvas.height;
        ctx.drawImage(video, 0, 0, w, h);
        const frame = ctx.getImageData(0, 0, w, h);
        const data = frame.data;
        const len = data.length;

        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const saturation = max - min;
          const brightness = (r + g + b) / 3;

          // Remove the video's neutral beige/grayish background:
          // Background in gemini_generated_video_6eafce35.mp4 has saturation < 22 and brightness > 170.
          // The gold loop has strong saturation (max-min > 30) or darker shadow tones.
          // The specular flash/gleam has brightness > 248.
          if (brightness > 248) {
            // Specular spark / flare: 100% visible
            data[i + 3] = 255;
          } else if (saturation < 20 && brightness > 170) {
            // Background: 100% transparent
            data[i + 3] = 0;
          } else if (saturation < 34 && brightness > 170) {
            // Smooth anti-aliased edge
            const factor = (saturation - 20) / 14;
            data[i + 3] = Math.round(255 * Math.max(0, Math.min(1, factor)));
          } else {
            // Gold metallic infinity heart loop
            data[i + 3] = 255;
          }
        }
        ctx.putImageData(frame, 0, 0);
      }
      animId = requestAnimationFrame(renderFrame);
    };

    video.play().catch(() => {});
    animId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animId);
      video.removeEventListener('loadedmetadata', setupCanvas);
    };
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Hidden source video */}
      <video
        ref={videoRef}
        src="/gemini_generated_video_6eafce35.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="hidden"
      />

      {/* Real-time Chroma/Luma Keyed Canvas for 100% Transparent Video */}
      <div className="relative w-64 sm:w-80 md:w-96 max-w-full aspect-video flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-contain filter drop-shadow-[0_12px_28px_rgba(212,175,55,0.35)] transition-opacity duration-500 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Fallback while video initializes: static transparent logo outline */}
        {!isReady && (
          <img
            src="/branding/agafari-logo-transparent.png"
            alt="Agafari Infinity Heart Logo"
            className="absolute inset-0 w-full h-full object-contain filter drop-shadow-md opacity-40 animate-pulse pointer-events-none"
          />
        )}
      </div>

      {/* Amharic Calligraphy Logo Text (አጋፋሪ) Matching Image 2 */}
      {showText && (
        <motion.img
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          src="/branding/agafari-text-gold.png"
          alt="Agafari (አጋፋሪ)"
          className="h-8 sm:h-11 md:h-12 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.3)] -mt-3 sm:-mt-5 select-none pointer-events-none"
        />
      )}
    </div>
  );
}
