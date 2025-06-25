// js/shop.js
import { gameState } from './state.js';
import { updateMiningPower } from './game.js';

export function openShop() {
    const shopModal = document.getElementById('shopModal');
    if (shopModal) {
        shopModal.classList.remove('hidden');
        shopModal.setAttribute('aria-hidden', 'false');
    }
}

export function closeShop() {
    const shopModal = document.getElementById('shopModal');
    if (shopModal) {
        shopModal.classList.add('hidden');
        shopModal.setAttribute('aria-hidden', 'true');
    }
}

const DAILY_REWARD_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in ms
const DAILY_REWARD_AMOUNT = 5; // Gems

export function isDailyRewardAvailable() {
    const s = gameState.getState();
    return Date.now() - s.lastDailyRewardClaimed > DAILY_REWARD_COOLDOWN;
}

export function getDailyRewardCooldown() {
    const s = gameState.getState();
    const timePassed = Date.now() - s.lastDailyRewardClaimed;
    return timePassed > DAILY_REWARD_COOLDOWN ? 0 : DAILY_REWARD_COOLDOWN - timePassed;
}

export function buyBoost(boostType, multiplier, duration, cost) {
    const s = gameState.getState();

    if (s.gems < cost) {
        return { success: false, message: '❌ Not enough gems!' };
    }

    // Check if a boost of the same type is already active and stronger
    const currentBoost = s.boosts[boostType];
    if (currentBoost && currentBoost.expiresAt > Date.now() && currentBoost.multiplier >= multiplier) {
        return { success: false, message: `🔥 A more powerful boost is already active!` };
    }

    const newExpiry = Date.now() + duration * 1000;

    gameState.updateState({
        gems: s.gems - cost,
        boosts: {
            ...s.boosts,
            [boostType]: {
                multiplier: multiplier,
                expiresAt: newExpiry
            }
        }
    });

    updateMiningPower();

    return { success: true, message: `🚀 ${multiplier}x Boost activated for ${duration / 60} minutes!` };
}

export function claimDailyReward() {
    if (isDailyRewardAvailable()) {
        const s = gameState.getState();
        gameState.updateState({
            gems: s.gems + DAILY_REWARD_AMOUNT,
            lastDailyRewardClaimed: Date.now()
        });
        return { success: true, message: `💎 You claimed ${DAILY_REWARD_AMOUNT} free gems!` };
    } else {
        return { success: false, message: '🕒 Daily reward is not available yet.' };
    }
}