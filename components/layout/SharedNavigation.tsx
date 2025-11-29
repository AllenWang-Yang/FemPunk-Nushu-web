'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from './SharedNavigation.module.css';

interface NavigationItem {
  label: string;
  path: string;
  key: string;
}

interface SharedNavigationProps {
  className?: string;
  variant?: 'default' | 'transparent';
}

const navigationItems: NavigationItem[] = [
  { label: 'PAINT', path: '/canvas', key: 'paint' },
  { label: 'COLOR', path: '/color', key: 'color' },
  { label: 'GALLERY', path: '/gallery', key: 'gallery' },
  { label: 'MY PAINTS', path: '/my-paints', key: 'my-paints' },
];

export function SharedNavigation({ className, variant = 'default' }: SharedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getActiveKey = () => {
    if (pathname === '/canvas') return 'paint';
    if (pathname === '/color') return 'color';
    if (pathname === '/gallery') return 'gallery';
    if (pathname === '/my-paints') return 'my-paints';
    return '';
  };

  const activeKey = getActiveKey();

  return (
    <>
      <nav className={`${styles.navbar} ${styles[variant]} ${className || ''}`}>
        <div className={styles.navbarBackdrop} />
        <div className={styles.navbarContent}>
          <div className={styles.navbarLeft}>
            <button 
              onClick={() => handleNavigation('/')} 
              className={styles.logo}
              aria-label="Go to homepage"
            >
              <Image
                src="/images/homepage/fempunk_logo.png"
                alt="FemPunk Logo"
                width={182}
                height={56}
                priority
              />
            </button>
            
            <nav className={styles.navLinks} role="navigation" aria-label="Main navigation">
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item.path)}
                  className={`${styles.navLink} ${activeKey === item.key ? styles.navLinkActive : ''}`}
                  aria-current={activeKey === item.key ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className={styles.navbarRight}>
            <ConnectButton 
              chainStatus="icon"
              accountStatus="address"
              showBalance={false}
            />
          </div>
        </div>
      </nav>
    </>
  );
}