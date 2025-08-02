'use client';

import { useState, useEffect } from 'react';
import styles from './Gallery.module.css';
import { updateLightingLevel, subscribeToLightingLevel } from '@/lib/firebase';

const artworks = [
  {
    id: 1,
    title: '별이 빛나는 밤',
    artist: '빈센트 반 고흐',
    year: '1889',
    image: '/artworks/IMG＿0766.jpg',
    description: '프로방스의 밤하늘을 그린 유명한 작품'
  },
  {
    id: 2,
    title: '모나리자',
    artist: '레오나르도 다 빈치',
    year: '1503-1519',
    image: '/artworks/IMG＿7247.jpg',
    description: '세계에서 가장 유명한 초상화'
  },
  {
    id: 3,
    title: '절규',
    artist: '에드바르 뭉크',
    year: '1893',
    image: '/artworks/IMG＿7247.jpg',
    description: '표현주의의 대표작'
  }
];

export default function Gallery() {
  const [lightingLevel, setLightingLevel] = useState(5);

  useEffect(() => {
    const unsubscribe = subscribeToLightingLevel((level) => {
      setLightingLevel(level);
    });
    return () => unsubscribe();
  }, []);

  const handleLightingChange = async (newLevel) => {
    await updateLightingLevel(newLevel);
  };

  return (
    <div className={styles.galleryContainer} style={{ '--lighting-level': lightingLevel }}>
      <div className={styles.lightingControl}>
        <button 
          onClick={() => handleLightingChange(Math.max(1, lightingLevel - 1))}
          disabled={lightingLevel <= 1}
        >
          -
        </button>
        <span>조명 강도: {lightingLevel}</span>
        <button 
          onClick={() => handleLightingChange(Math.min(10, lightingLevel + 1))}
          disabled={lightingLevel >= 10}
        >
          +
        </button>
      </div>

      <div className={styles.gallerySpace}>
        {artworks.map((artwork) => (
          <div key={artwork.id} className={styles.artworkContainer}>
            <div className={styles.artworkFrame}>
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className={styles.artwork}
              />
            </div>
            <div className={styles.caption}>
              <h3>{artwork.title}</h3>
              <p className={styles.artist}>{artwork.artist}, {artwork.year}</p>
              <p className={styles.description}>{artwork.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
