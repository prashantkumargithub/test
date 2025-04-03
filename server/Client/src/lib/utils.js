import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/lottie-json"
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[2px] border[#ff006faa]",
  "bg-[#ffd60a2a] text-[#ffd60a] border-[2px] border[#ffd60abb]",
  "bg-[#06d6a02a] text-[#06d6a0] border-[2px] border[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[2px] border[#4cc9f0bb]",
]

export const getColor = (color) => {
  if (typeof color === 'number' && color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0];
};

export const animationDefaultOtpions = {
  loop:true,
  autoplay:true,
  animationData:animationData
}
