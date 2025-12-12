'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AudioPlayer from './components/AudioPlayer';
import YouTubePlayer from './components/YouTubePlayer';
import BackgroundSlideshow from './components/BackgroundSlideshow';
import CharacterBackground from './components/CharacterBackground';

interface Phase {
  id: number;
  character: string;
  text: string;
  audio?: string;
  youtubeId?: string;
  isYouTube?: boolean;
  backgroundImage?: string;
  characterImage?: string;
}

const phases: Phase[] = [
  {
    id: 1,
    character: '', // Removed "Woody" name
    text: 'Alguém quer falar com você', // Will only show after audio ends
    audio: '/audios/woody.mp3',
    characterImage: 'https://atlantidasc.com.br/wp-content/uploads/2025/11/Disney-Pixar_Divulgacao.jpg',
  },
  {
    id: 2,
    character: 'Mike Wazowski',
    text: 'Mike Wazowski quer falar com você',
    audio: '/audios/mike.mp3',
    characterImage: 'https://i.pinimg.com/736x/c2/bd/97/c2bd97e498186f4b2f949e6de6a9f975.jpg',
  },
  {
    id: 3,
    character: 'Stitch',
    text: 'Stitch quer falar com você',
    audio: '/audios/stich.mp3',
    characterImage: 'https://i.pinimg.com/736x/f7/0f/1e/f70f1e6cf74a7e79c6412daf64b238e2.jpg',
  },
  {
    id: 4,
    character: 'Relâmpago McQueen',
    text: 'Relâmpago McQueen quer falar com você',
    audio: '/audios/relampago.mp3',
    characterImage: 'https://lumiere-a.akamaihd.net/v1/images/cars80-1200x801_7b6d9330.jpeg?region=0,60,1200,677&width=960',
  },
  {
    id: 5,
    character: '',
    text: 'Está pronta? Então abra a porta e escute a próxima pessoa.',
    audio: undefined,
  },
  {
    id: 6,
    character: 'Mickey',
    text: 'Mickey quer falar com você',
    audio: '/audios/mickey.mp3',
    characterImage: 'https://media.disneylandparis.com/d4th/pt-pt/images/hd18943_2027jul06_world_mickey-and-friends-minnie-donald-pluto-goofy-behind-castle-disneyland-paris_3-4_tcm851-266998.jpg',
  },
  {
    id: 7,
    character: '',
    text: '',
    youtubeId: 'vk6014HuxcE',
    isYouTube: true,
  },
];

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [audioFinished, setAudioFinished] = useState(false);

  // Reset audioFinished when phase changes
  useEffect(() => {
    const currentPhaseData = phases[currentPhase];
    if (!currentPhaseData.isYouTube && !currentPhaseData.audio) {
      // For phases without audio (like the "ready" phase), enable next button immediately
      setAudioFinished(true);
    } else if (!currentPhaseData.isYouTube) {
      setAudioFinished(false);
    }
  }, [currentPhase]);

  const goToNext = () => {
    if (currentPhase < phases.length - 1 && audioFinished) {
      setCurrentPhase(currentPhase + 1);
      setAudioFinished(false); // Reset for next phase
    }
  };

  const goToPrevious = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
      setAudioFinished(false); // Reset when going back
    }
  };

  const handleAudioEnded = () => {
    setAudioFinished(true);
  };

  const handleVideoEnd = () => {
    setAudioFinished(true);
  };

  const currentPhaseData = phases[currentPhase];
  const isYouTubePhase = currentPhaseData.isYouTube;
  const isFirstPhase = currentPhase === 0;
  // For Woody: show background only after audio ends
  const showWoodyBackground = isFirstPhase && audioFinished && currentPhaseData.characterImage;
  // For other phases: show background from the start if they have characterImage
  const showOtherCharacterBackground = !isFirstPhase && !isYouTubePhase && currentPhaseData.characterImage;
  const showAnyBackground = isYouTubePhase || showWoodyBackground || showOtherCharacterBackground;

  return (
    <div className={`flex min-h-screen flex-col items-center justify-center px-4 py-8 relative ${
      showAnyBackground
        ? '' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800'
    }`}>
      {/* Background Slideshow - Only for YouTube phase */}
      {isYouTubePhase && <BackgroundSlideshow />}
      
      {/* Woody Background - Only after audio ends */}
      {showWoodyBackground && (
        <CharacterBackground 
          imageUrl={currentPhaseData.characterImage!} 
          alt="Woody background" 
        />
      )}
      
      {/* Other Character Backgrounds - From the start */}
      {showOtherCharacterBackground && (
        <CharacterBackground 
          imageUrl={currentPhaseData.characterImage!} 
          alt={currentPhaseData.character || 'Character background'} 
        />
      )}
      
      <main className={`flex w-full max-w-2xl flex-col items-center justify-center space-y-6 sm:space-y-8 flex-1 relative z-10 ${
        showAnyBackground ? 'text-white' : ''
      }`}>
        {/* Volume Warning - Only on first phase */}
        {currentPhase === 0 && (
          <div className="w-full max-w-md mx-auto mb-4 p-4 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-lg font-bold text-center text-yellow-800 dark:text-yellow-200">
                🔊 Aumente o volume do celular no máximo!
              </p>
            </div>
          </div>
        )}

        {/* Audio Player or YouTube Player */}
        <div className="w-full mt-4 sm:mt-8 px-2">
          {currentPhaseData.isYouTube && currentPhaseData.youtubeId ? (
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 w-full">
              {/* YouTube Player */}
              <div className="w-full max-w-md">
                <YouTubePlayer videoId={currentPhaseData.youtubeId} onVideoEnd={handleVideoEnd} />
              </div>
              
              {/* Photo with Label */}
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="mb-2 sm:mb-3">
                  <p className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg text-center">
                    09/26 🇺🇸
                  </p>
                </div>
                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-2xl border-2 sm:border-4 border-white/50">
                  <Image
                    src="/nos.jpg"
                    alt="Nós"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          ) : currentPhaseData.audio ? (
            <div className="flex flex-col items-center gap-3 sm:gap-4 w-full">
              {/* Text Label - Show immediately for all phases */}
              {currentPhaseData.text && (
                <div className="text-center px-4">
                  <p className={`text-lg sm:text-xl md:text-2xl font-semibold ${
                    showAnyBackground
                      ? 'text-white drop-shadow-lg'
                      : 'text-zinc-700 dark:text-zinc-200'
                  }`}>
                    {currentPhaseData.text}
                  </p>
                </div>
              )}
              
              {/* Character Image - Above audio player */}
              {/* For Woody: only show after audio ends. For others: show immediately */}
              {currentPhaseData.characterImage && (
                (isFirstPhase ? audioFinished : true) && (
                  <div className="relative w-full max-w-40 sm:max-w-48 aspect-square rounded-lg overflow-hidden shadow-xl">
                    <Image
                      src={currentPhaseData.characterImage}
                      alt={currentPhaseData.character || 'Personagem'}
                      fill
                      className="object-cover"
                      priority
                      unoptimized
                    />
                  </div>
                )
              )}
              
              {/* Audio Player */}
              <AudioPlayer src={currentPhaseData.audio} onAudioEnded={handleAudioEnded} />
            </div>
          ) : (
            // Phase without audio (like "ready" phase)
            currentPhaseData.text && (
              <div className="text-center px-4">
                <p className="text-lg sm:text-xl md:text-2xl font-semibold text-zinc-700 dark:text-zinc-200">
                  {currentPhaseData.text}
                </p>
              </div>
            )
          )}
        </div>
      </main>

      {/* Navigation Buttons */}
      <div className={`w-full max-w-2xl flex justify-between items-center gap-2 sm:gap-4 mt-4 sm:mt-8 pb-4 sm:pb-8 px-2 relative z-10`}>
        <button
          onClick={goToPrevious}
          disabled={currentPhase === 0}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-all ${
            currentPhase === 0
              ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed'
              : showAnyBackground
              ? 'bg-blue-600/90 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          ← Anterior
        </button>

        <div className={`text-sm sm:text-base font-medium px-2 ${
          showAnyBackground
            ? 'text-white drop-shadow-lg'
            : 'text-zinc-600 dark:text-zinc-400'
        }`}>
          {currentPhase + 1} / {phases.length}
        </div>

        <button
          onClick={goToNext}
          disabled={currentPhase === phases.length - 1 || !audioFinished}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-all ${
            currentPhase === phases.length - 1 || !audioFinished
              ? 'bg-zinc-300 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-500 cursor-not-allowed'
              : showAnyBackground
              ? 'bg-blue-600/90 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          Próximo →
        </button>
      </div>
    </div>
  );
}
