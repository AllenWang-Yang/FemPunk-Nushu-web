'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { WalletModal } from '../wallet/WalletModal';
import { useWalletModal } from '../../lib/hooks/useWalletModal';
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
  { label: 'COLOR', path: '/buy', key: 'color' },
  { label: 'GALLERY', path: '/gallery', key: 'gallery' },
];

export function SharedNavigation({ className, variant = 'default' }: SharedNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { modalState, openModal: openWalletModal, closeModal: closeWalletModal } = useWalletModal();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getActiveKey = () => {
    if (pathname === '/canvas') return 'paint';
    if (pathname === '/buy') return 'color';
    if (pathname === '/gallery') return 'gallery';
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
            <button 
              className={styles.connectButton}
              onClick={isConnected ? () => {} : () => openWalletModal()}
              aria-label={isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect wallet'}
            >
              <Image
                src="/images/homepage/wallet.png"
                alt=""
                width={19}
                height={18}
                aria-hidden="true"
              />
              <span>
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <WalletModal 
        isOpen={modalState.isOpen}
        onClose={closeWalletModal}
      />
    </>
  );
}