'use client';

import { useEffect, useRef, useState } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  onVideoEnd?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({ videoId, onVideoEnd }: YouTubePlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract video ID from URL if needed
  const getVideoId = (id: string) => {
    if (id.includes('youtube.com') || id.includes('youtu.be')) {
      const match = id.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? match[1] : id;
    }
    return id;
  };

  const finalVideoId = getVideoId(videoId);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        if (containerRef.current && !playerRef.current) {
          playerRef.current = new window.YT.Player(containerRef.current, {
            videoId: finalVideoId,
            playerVars: {
              autoplay: 1,
              mute: 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
            },
            events: {
              onReady: () => {
                setIsReady(true);
                // Start playing automatically when ready (user already clicked "Next" button)
                setTimeout(() => {
                  playerRef.current?.playVideo();
                }, 100);
              },
              onStateChange: (event: any) => {
                // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
                if (event.data === window.YT.PlayerState.ENDED) {
                  if (onVideoEnd) {
                    onVideoEnd();
                  }
                }
              },
            },
          });
        }
      };
    } else if (window.YT && window.YT.Player) {
      // API already loaded
      if (containerRef.current && !playerRef.current) {
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: finalVideoId,
          playerVars: {
            autoplay: 1,
            mute: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: () => {
              setIsReady(true);
              // Start playing automatically when ready (user already clicked "Next" button)
              setTimeout(() => {
                playerRef.current?.playVideo();
              }, 100);
            },
            onStateChange: (event: any) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                if (onVideoEnd) {
                  onVideoEnd();
                }
              }
            },
          },
        });
      }
    }

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore errors during cleanup
        }
        playerRef.current = null;
      }
    };
  }, [finalVideoId, onVideoEnd]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div
            ref={containerRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}

