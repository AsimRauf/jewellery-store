'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

interface ImageCarouselProps {
  folder: 'categories' | 'styles';
}

interface ImageData {
  name: string;
  path: string;
}

export default function ImageCarousel({ folder }: ImageCarouselProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      try {
        const response = await fetch(`/api/images?folder=${folder}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImages(data.images);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [folder]);

  if (loading) {
    return <div className="text-center">Loading images...</div>;
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={50}
      slidesPerView={3}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      }}
    >
      {images.map((image) => (
        <SwiperSlide key={image.path}>
          <Link href={`/engagement/${folder}/${image.name.replace(/\.[^/.]+$/, "")}`} passHref>
            <div className="group relative block w-full h-96">
              <Image
                src={image.path}
                alt={image.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <h3 className="text-white text-lg font-semibold capitalize">{image.name.replace(/-/g, ' ').replace(/\.[^/.]+$/, "")}</h3>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}