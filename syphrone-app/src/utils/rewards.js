import { useState, useEffect, useCallback } from 'react';
import haptic from './haptics';
import { playCoinSound } from './coinSound';

const COINS_KEY = 'syphrone-coins-v1';
const DEFAULT_INITIAL_COINS = 500; // Welcome Bonus for new users!

export function getSavedCoins() {
  try {
    const val = localStorage.getItem(COINS_KEY);
    if (val === null) {
      localStorage.setItem(COINS_KEY, DEFAULT_INITIAL_COINS.toString());
      return DEFAULT_INITIAL_COINS;
    }
    return parseInt(val, 10) || 0;
  } catch {
    return DEFAULT_INITIAL_COINS;
  }
}

export function saveCoins(amount) {
  try {
    localStorage.setItem(COINS_KEY, amount.toString());
    window.dispatchEvent(new CustomEvent('syphrone:coins-updated', { detail: amount }));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Lightweight hook that only listens to balance changes (No interval timer)
 */
export function useCoins() {
  const [coins, setCoins] = useState(() => getSavedCoins());

  useEffect(() => {
    const handler = (e) => {
      if (typeof e.detail === 'number') {
        setCoins(e.detail);
      } else {
        setCoins(getSavedCoins());
      }
    };
    window.addEventListener('syphrone:coins-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('syphrone:coins-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const deductCoins = useCallback((amount) => {
    const current = getSavedCoins();
    if (current >= amount) {
      const next = current - amount;
      saveCoins(next);
      setCoins(next);
      haptic.success();
      return true;
    }
    haptic.error();
    return false;
  }, []);

  const addCoins = useCallback((amount) => {
    const next = getSavedCoins() + amount;
    saveCoins(next);
    setCoins(next);
    playCoinSound();
  }, []);

  return { coins, deductCoins, addCoins };
}

/**
 * Dedicated hook for the Coin Pill that runs the 30s reward countdown.
 * Kept isolated inside the Header CoinPill so it NEVER re-renders App or the page!
 */
export function useCoinRewards() {
  const { coins, deductCoins, addCoins } = useCoins();
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [showRewardToast, setShowRewardToast] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(200);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Award +200 coins
          const newTotal = getSavedCoins() + 200;
          saveCoins(newTotal);

          // Haptic, Coin Spinning Audio & Toast
          haptic.success();
          playCoinSound();
          setRewardAmount(200);
          setShowRewardToast(true);
          setTimeout(() => setShowRewardToast(false), 2800);

          return 30; // Reset 30s loop timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    coins,
    secondsLeft,
    showRewardToast,
    rewardAmount,
    deductCoins,
    addCoins,
  };
}
