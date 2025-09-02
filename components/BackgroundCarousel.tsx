'use client';

import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const darkImages = [
  '/backgroundDarkI.png',
  '/backgroundDarkII.png',
];

const lightImages = [
  '/backgroundLightI.png',
  '/backgroundLightII.png',
];

const BackgroundCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const { theme, resolvedTheme } = useTheme();
  const [currentImages, setCurrentImages] = useState(lightImages);

  useEffect(() => {
    const images = resolvedTheme === 'dark' ? darkImages : lightImages;
    setCurrentImages(images);
  }, [resolvedTheme]);

  return (
    <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden" ref={emblaRef}>
      <div className="flex h-full">
        {currentImages.map((src, index) => (
          <div className="relative flex-[0_0_100%] h-full" key={index}>
            <Image
              src={src}
              alt={`High-tech background ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              className="opacity-30 dark:opacity-40 transition-opacity duration-1000"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-light via-background-light/70 to-transparent dark:from-background-dark dark:via-background-dark/80" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundCarousel;
