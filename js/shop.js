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