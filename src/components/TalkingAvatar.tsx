import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

interface TalkingAvatarProps {
  avatar: any;
  isTalking: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking';
}

export function TalkingAvatar({ avatar, isTalking, emotion = 'neutral' }: TalkingAvatarProps) {
  // Animation variants
  const talkingVariants = {
    talking: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    idle: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const gestureVariants = {
    neutral: { y: 0 },
    happy: { 
      y: [0, -15, 0],
      transition: { duration: 0.6, repeat: isTalking ? Infinity : 0, repeatDelay: 1 } 
    },
    thinking: { 
      rotate: [0, 10, -10, 0],
      transition: { duration: 2, repeat: Infinity }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      <motion.div
        animate={isTalking ? "talking" : "idle"}
        variants={talkingVariants}
        className="relative z-10"
      >
        <motion.div
          animate={emotion}
          variants={gestureVariants}
          className="text-9xl cursor-pointer filter drop-shadow-xl"
        >
          {avatar.emoji || '🤖'}
        </motion.div>
      </motion.div>
      
      {/* Dynamic speech ripple/aura effect when talking */}
      {isTalking && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.4, 0], scale: 1.4 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full -z-10 blur-2xl"
          />
           <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.3, 0], scale: 1.6 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full -z-10 blur-2xl"
          />
        </>
      )}
    </div>
  );
}
