
import React from 'react';
import { Heart, Code, Briefcase, Mail, Github, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-12 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-48 h-48 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-glow animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="text-white" size={16} />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Projobhub
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              India's most trusted job portal connecting talented professionals with top companies.
            </p>
            <div className="flex items-center gap-2 text-blue-200">
              <Code className="w-4 h-4" />
              <span className="text-xs">Powered by modern technology</span>
            </div>
          </div>

          {/* About Section - Compact */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">About Projobhub</h3>
            <div className="space-y-2 text-gray-300">
              <p className="text-xs leading-relaxed">
                <strong className="text-white">Mission:</strong> Bridge the gap between talented professionals and innovative companies.
              </p>
              <p className="text-xs leading-relaxed">
                <strong className="text-white">Vision:</strong> India's leading platform for career advancement and innovation.
              </p>
              <p className="text-xs leading-relaxed">
                <strong className="text-white">Values:</strong> Transparency, innovation, and empowerment.
              </p>
            </div>
          </div>

          {/* Creator Section - Compact */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">Created By</h3>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">KY</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Krish Yadav</h4>
                  <p className="text-blue-200 text-xs">Full Stack Developer</p>
                </div>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed mb-2">
                Passionate developer building the future of job discovery.
              </p>
              <div className="flex gap-2">
                <a 
                  href="mailto:your-email@example.com"
                  className="w-7 h-7 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="text-white" size={12} />
                </a>
                <a 
                  href="https://github.com/krishyadav90"
                  className="w-7 h-7 bg-gray-800 hover:bg-gray-900 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="text-white" size={12} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/krish-yadav-aba86a2bb/"
                  className="w-7 h-7 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="text-white" size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-white/20 pt-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>&copy; {currentYear} Projobhub</span>
              <span className="text-white/40">•</span>
              <span>All rights reserved</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <span>Made with</span>
              <Heart className="text-red-400 w-4 h-4 animate-pulse" />
              <span>by</span>
              <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Krish Yadav
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
