'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PageLayout } from '../layout/PageLayout';
import { RevenueModal, useRevenueModal } from '../revenue/RevenueManager';
import { SendRevenueButton } from '../revenue/RevenueButton';
import { SetupGuide } from '../setup/SetupGuide';
import styles from './OptimizedHomePage.module.css';

interface ArtworkData {
  id: string;
  imageUrl: string;
  alt: string;
}

const FEATURED_ARTWORKS: ArtworkData[] = [
  {
    id: '1',
    imageUrl: '/images/homepage/second_bg.png',
    alt: 'Community Artwork 1'
  },
  {
    id: '2', 
    imageUrl: '/images/homepage/kuang.png',
    alt: 'Community Artwork 2'
  },
  {
    id: '3',
    imageUrl: '/images/homepage/second_bg.png',
    alt: 'Community Artwork 3'
  },
  {
    id: '4',
    imageUrl: '/images/homepage/kuang.png',
    alt: 'Community Artwork 4'
  },
  {
    id: '5',
    imageUrl: '/images/homepage/second_bg.png',
    alt: 'Community Artwork 5'
  },
  {
    id: '6',
    imageUrl: '/images/homepage/kuang.png',
    alt: 'Community Artwork 6'
  }
];

export function OptimizedHomePage() {
  const router = useRouter();
  const { isOpen, mode, canvasId, openModal, closeModal } = useRevenueModal();

  const handleStartPainting = useCallback(() => {
    console.log('Start Painting button clicked!');
    router.push('/canvas');
  }, [router]);

  const handleViewAllArtworks = useCallback(() => {
    router.push('/gallery');
  }, [router]);

  const handleBuyArtwork = useCallback((artworkId: string) => {
    console.log('Buy artwork:', artworkId);
    // TODO: Implement buy functionality
  }, []);

  const handleMintArtwork = useCallback((artworkId: string) => {
    console.log('Mint artwork:', artworkId);
    // Open revenue modal directly for quick minting
    const canvasIdNum = parseInt(artworkId) || 1; // Default to canvas ID 1
    openModal(canvasIdNum, 'send');
  }, [openModal]);

  return (
    <PageLayout navigationVariant="transparent" className={styles.homePage}>
      <div className={styles.container}>
        {/* Fixed Background Layers */}
        <div className={styles.backgroundLayers}>
          <div className={styles.gradientOverlay} />
          <div className={styles.bgMainImage}>
            <Image
              src="/images/homepage/top_bg.png"
              alt=""
              width={1440}
              height={862}
              priority
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
          </div>
        </div>

        {/* Scrollable Decorative elements */}
        <div className={styles.decorLeft}>
          <Image
            src="/images/homepage/left_img1.png"
            alt=""
            width={314}
            height={476}
          />
        </div>
        
        <div className={styles.decorRight}>
          <Image
            src="/images/homepage/right_img1.png"
            alt=""
            width={359}
            height={468}
          />
        </div>

        <div className={styles.decorRight3}>
          <Image
            src="/images/homepage/right_img3.png"
            alt=""
            width={226}
            height={194}
          />
        </div>

        {/* Line decorations */}
        <div className={styles.line1}>
          <Image
            src="/images/homepage/line_1.png"
            alt=""
            width={1440}
            height={188}
          />
        </div>

        <div className={styles.line2}>
          <Image
            src="/images/homepage/line_2.png"
            alt=""
            width={1440}
            height={151}
          />
        </div>

        {/* Words decorations */}
        <div className={styles.words1}>
          <Image
            src="/images/homepage/words1.png"
            alt=""
            width={364}
            height={40}
          />
        </div>

        <div className={styles.words2}>
          <Image
            src="/images/homepage/words2.png"
            alt=""
            width={526}
            height={40}
          />
        </div>

        {/* Thorn decorations */}
        <div className={styles.thorn1}>
          <Image
            src="/images/homepage/荆棘 1.png"
            alt=""
            width={726}
            height={123}
          />
        </div>

        <div className={styles.thorn2}>
          <Image
            src="/images/homepage/荆棘 3.png"
            alt=""
            width={630}
            height={187}
          />
        </div>

        {/* Additional decorations */}
        <div className={styles.words3}>
          <Image
            src="/images/homepage/words3.png"
            alt=""
            width={656}
            height={40}
          />
        </div>

        <div className={styles.nvshu1}>
          <Image
            src="/images/homepage/nvshu1.png"
            alt=""
            width={186}
            height={53}
          />
        </div>

        <div className={styles.today}>
          <Image
            src="/images/homepage/today.png"
            alt=""
            width={217}
            height={53}
          />
        </div>

        {/* Frame and Nvshu character */}
        <div className={styles.kuangFrame}>
          <Image
            src="/images/homepage/kuang.png"
            alt=""
            width={514}
            height={514}
          />
        </div>

        <div className={styles.nvshuChar}>
          <Image
            src="/images/homepage/nvshu.png"
            alt=""
            width={302}
            height={302}
          />
        </div>

        {/* Start Painting Button */}
        <div className={styles.ctaButtonWrapper}>
          <button
            className={styles.startPaintingButton}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Button clicked!', e);
              handleStartPainting();
            }}
            aria-describedby="paint-description"
          >
            <span style={{ marginRight: '8px', fontSize: '28px' }} aria-hidden="true">🎨</span>
            <span>Start Painting</span>
          </button>
          <p id="paint-description" className={styles.srOnly}>
            Begin collaborative painting on today&apos;s canvas
          </p>
        </div>

        <div className={styles.leftDecor}>
          <Image
            src="/images/homepage/left.png"
            alt=""
            width={445}
            height={382}
          />
        </div>

        <div className={styles.rightDecor}>
          <Image
            src="/images/homepage/right.png"
            alt=""
            width={559}
            height={486}
          />
        </div>

        {/* Community section decorations */}
        <div className={styles.communityArt}>
          <Image
            src="/images/homepage/communityArt.png"
            alt=""
            width={491}
            height={55}
          />
        </div>

        <div className={styles.words4}>
          <Image
            src="/images/homepage/words4.png"
            alt=""
            width={778}
            height={40}
          />
        </div>

        {/* Artworks Canvas and Buttons */}
        <div className={styles.artworkCanvas1}></div>
        <button className={styles.artworkButton1}>Mint</button>

        <div className={styles.artworkCanvas2}></div>
        <button className={styles.artworkButton2}>Buy</button>

        <div className={styles.artworkCanvas3}></div>
        <button className={styles.artworkButton3}>Buy</button>

        <div className={styles.artworkCanvas4}></div>
        <button className={styles.artworkButton4}>Buy</button>

        <div className={styles.artworkCanvas5}></div>
        <button className={styles.artworkButton5}>Buy</button>

        <div className={styles.artworkCanvas6}></div>
        <button className={styles.artworkButton6}>Buy</button>

        {/* View All Link */}
        <div className={styles.viewAllLink}>
          <button onClick={handleViewAllArtworks} className={styles.viewAllButton}>
            <span>View all artworks</span>
            <span style={{ marginLeft: '8px', fontSize: '20px' }} aria-hidden="true">→</span>
          </button>
        </div>

        {/* Hero Section */}
        <section className={styles.heroSection} aria-labelledby="hero-title">
          <div className={styles.heroTitle} id="hero-title">
            <Image
              src="/images/homepage/NvshuReborn.png"
              alt="Nvshu Reborn Art Co-creation"
              width={846}
              height={233}
              priority
              sizes="(max-width: 768px) 90vw, 846px"
            />
          </div>

          {/* Decorative Elements */}
          <div className={styles.decorLeft2}>
            <Image
              src="/images/homepage/left_img2.png"
              alt=""
              width={268}
              height={172}
            />
          </div>
          <div className={styles.decorRight2}>
            <Image
              src="/images/homepage/right_img2.png"
              alt=""
              width={237}
              height={153}
            />
          </div>
        </section>

        {/* Nvshu of Today Section - Empty placeholder */}
        <section className={styles.nvshuTodaySection} aria-labelledby="nvshu-today-title">
        </section>

        {/* Community Artworks Section - Empty placeholder for structure */}
        <section className={styles.communitySection} aria-labelledby="community-title">
        </section>
      </div>

      {/* Revenue Modal */}
      <RevenueModal
        isOpen={isOpen}
        onClose={closeModal}
        canvasId={canvasId}
        mode={mode}
      />

      {/* Setup Guide */}
      <SetupGuide />
    </PageLayout>
  );
}