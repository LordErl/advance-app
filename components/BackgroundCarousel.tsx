'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';

const backgrounds = [
  '/images/backgrounds/employee-advance-bg.svg',
  '/images/backgrounds/travel-advance-bg.svg',
  '/images/backgrounds/daily-allowance-bg.svg',
];

const BackgroundCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden" ref={emblaRef}>
      <div className="flex h-full w-full">
        {backgrounds.map((src, index) => (
          <div className="relative h-full w-full flex-shrink-0" key={index}>
            <Image
              src={src}
              alt={`Background ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="transition-opacity duration-1000"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundCarousel;
