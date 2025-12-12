'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const nyImages = [
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80',
  'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=1920&q=80',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1920&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80',
  'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&q=80',
  'https://images.unsplash.com/photo-1534430480872-3490d3c4e7c5?w=1920&q=80',
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd81e?w=1920&q=80',
];

export default function BackgroundSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % nyImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {nyImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={image}
            alt={`New York ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            unoptimized
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}
    </div>
  );
}

