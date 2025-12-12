'use client';

import Image from 'next/image';

interface CharacterBackgroundProps {
  imageUrl: string;
  alt: string;
}

export default function CharacterBackground({ imageUrl, alt }: CharacterBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover"
        priority
        unoptimized
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}

