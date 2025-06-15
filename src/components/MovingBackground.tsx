
import * as React from "react";

export function MovingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Modern gradient background with enhanced performance */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />
      
      {/* Optimized animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob will-change-transform" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 will-change-transform" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 will-change-transform" />
      </div>
      
      {/* Performance-optimized grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          willChange: 'transform'
        }} />
      </div>
      
      {/* GPU-accelerated floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Hexagons with smooth rotation */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 opacity-20 will-change-transform">
          <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 transform rotate-45 animate-[spin_20s_linear_infinite]" />
        </div>
        <div className="absolute top-3/4 right-1/4 w-12 h-12 opacity-30 will-change-transform">
          <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500 transform rotate-12 animate-[spin_15s_linear_infinite]" />
        </div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 opacity-15 will-change-transform">
          <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 transform -rotate-45 animate-[spin_25s_linear_infinite]" />
        </div>
        
        {/* Enhanced floating circles with hardware acceleration */}
        <div className="absolute top-1/6 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full backdrop-blur-sm animate-float will-change-transform" style={{ animationDelay: '0s', animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-teal-500/20 rounded-full backdrop-blur-sm animate-float will-change-transform" style={{ animationDelay: '2s', animationDuration: '8s' }} />
        <div className="absolute top-1/3 left-2/3 w-40 h-40 bg-gradient-to-r from-indigo-400/15 to-purple-500/15 rounded-full backdrop-blur-sm animate-float will-change-transform" style={{ animationDelay: '4s', animationDuration: '10s' }} />
      </div>
      
      {/* Optimized animated particles with reduced count for better performance */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Additional floating elements for depth */}
      <div className="absolute inset-0">
        <div className="absolute top-1/5 left-1/5 w-6 h-6 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full animate-float will-change-transform" style={{ animationDelay: '1s', animationDuration: '7s' }} />
        <div className="absolute bottom-1/3 right-1/5 w-8 h-8 bg-gradient-to-r from-rose-400/25 to-orange-400/25 rounded-full animate-float will-change-transform" style={{ animationDelay: '3s', animationDuration: '9s' }} />
        <div className="absolute top-2/3 left-1/3 w-4 h-4 bg-gradient-to-r from-violet-400/35 to-purple-400/35 rounded-full animate-float will-change-transform" style={{ animationDelay: '5s', animationDuration: '11s' }} />
      </div>
    </div>
  );
}
