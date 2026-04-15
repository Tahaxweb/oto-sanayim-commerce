'use client'
import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-8">
        {/* Breathing logo */}
        <div className="relative">
          {/* Glow effect */}
          
          {/* Logo - breathing animation */}
          <div className="relative animate-[breathe_2s_ease-in-out_infinite]">
            <Image
              src="/images/logos/primary-logo.svg"
              alt="OtoSanayim Logo"
              width={200}
              height={65}
              priority
              className="drop-shadow-xl"
            />
          </div>
        </div>

      
      </div>

      {/* Breathing animation - smooth fade + scale */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}