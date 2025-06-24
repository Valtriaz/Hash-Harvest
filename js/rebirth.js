// Rebirth system module
import { gameState } from './state.js';
import { updateMiningPower } from './game.js';
import { renderUI, showMessage } from './ui.js';

const REBIRTH_REQUIREMENTS = [
    10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000, 100_000_000
];

export function getRebirthRequirement(level) {
    if (level < REBIRTH_REQUIREMENTS.length) {
        return REBIRTH_REQUIREMENTS[level];
    } else {
        return REBIRTH_REQUIREMENTS[REBIRTH_REQUIREMENTS.length - 1] * Math.pow(2, level - REBIRTH_REQUIREMENTS.length + 1);
    }
}

export function canRebirth(state) {
    const req = getRebirthRequirement(state.rebirthLevel);
    return state.totalMined >= req;
}

export function doRebirth() {
    const s = gameState.getState();
    const currentRequirement = getRebirthRequirement(s.rebirthLevel);
    if (s.totalMined >= currentRequirement) {
        const points = Math.floor(s.totalMined / currentRequirement);
        gameState.updateState({
            rebirthLevel: s.rebirthLevel + 1,
            rebirthPoints: s.rebirthPoints + points,
            rebirthMultiplier: s.rebirthMultiplier + points * 0.3,
            satoshis: 0,
            totalMined: 0,
            totalClicks: 0,
            startTime: Date.now(),
            prestigeLevel: 0,
            prestigeMultiplier: 1,
            gpu: { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 },
            cooling: { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 },
            powerSupply: { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 },
            quantumProcessor: { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 },
            automation: { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 },
            miningBoost: { level: 0, cost: 1, boost: 0.1, multiplier: 1.2 },
            efficiency: { level: 0, cost: 2, boost: 0.05, multiplier: 1.3 },
            luck: { level: 0, cost: 3, boost: 0.03, multiplier: 1.4 },
            altcoins: Object.fromEntries(Object.entries(s.altcoins).map(([k, v]) => [k, { ...v, holdings: 0 }]))
        });
        const nextRequirement = getRebirthRequirement(s.rebirthLevel + 1);
        showMessage(`🔥 Rebirth ${s.rebirthLevel + 1}! +${points} points, +${(points * 0.3).toFixed(1)}x multiplier! Next: ${nextRequirement.toLocaleString()} sats`, 'success');
        updateMiningPower();
        renderUI();
    } else {
        showMessage(`❌ Need ${currentRequirement.toLocaleString()}+ sats to rebirth!`, 'error');
    }
} 