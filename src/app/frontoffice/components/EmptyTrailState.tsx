import { Lock, BookOpen, TrendingUp } from 'lucide-react';

export function EmptyTrailState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      {/* Decorative Icon Illustration */}
      <div className="relative mb-8">
        {/* Background Circle */}
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center relative overflow-hidden">
          {/* Subtle Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="25" cy="25" r="2" fill="currentColor" className="text-blue-600"/>
              <circle cx="75" cy="25" r="2" fill="currentColor" className="text-green-600"/>
              <circle cx="25" cy="75" r="2" fill="currentColor" className="text-blue-600"/>
              <circle cx="75" cy="75" r="2" fill="currentColor" className="text-green-600"/>
              <circle cx="50" cy="50" r="2" fill="currentColor" className="text-slate-600"/>
            </svg>
          </div>

          {/* Main Icon Group */}
          <div className="relative z-10 flex items-center justify-center">
            {/* Book Icon */}
            <div className="absolute -left-8 -top-4">
              <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center transform rotate-12">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            {/* Chart Icon */}
            <div className="absolute -right-8 top-4">
              <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center transform -rotate-12">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Lock Icon (Center) */}
            <div className="w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl shadow-lg flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-slate-800 mb-3 text-center">
        Conteúdo em breve
      </h2>

      {/* Subtitle */}
      <p className="text-gray-600 text-center max-w-md leading-relaxed">
        Os materiais desta trilha ainda estão sendo organizados. Fique de olho nas novidades!
      </p>

      {/* Optional Decorative Element */}
      <div className="mt-8 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
