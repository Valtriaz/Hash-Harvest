// Prestige system module
import { gameState } from './state.js';
import { updateMiningPower } from './game.js';
import { renderUI, showMessage } from './ui.js';

const PRESTIGE_REQUIREMENTS = [
    1_000_000, 2_500_000, 5_000_000, 10_000_000, 25_000_000, 50_000_000, 100_000_000, 250_000_000, 500_000_000, 1_000_000_000, 2_000_000_000, 5_000_000_000, 10_000_000_000
];

export function getPrestigeRequirement(level) {
    if (level < PRESTIGE_REQUIREMENTS.length) {
        return PRESTIGE_REQUIREMENTS[level];
    } else {
        return PRESTIGE_REQUIREMENTS[PRESTIGE_REQUIREMENTS.length - 1] * Math.pow(2, level - PRESTIGE_REQUIREMENTS.length + 1);
    }
}

export function canPrestige(state) {
    const req = getPrestigeRequirement(state.prestigeLevel);
    return state.totalMined >= req;
}

export function doPrestige() {
    const s = gameState.getState();
    const currentRequirement = getPrestigeRequirement(s.prestigeLevel);
    if (s.totalMined >= currentRequirement) {
        const multiplier = Math.floor(s.totalMined / currentRequirement);
        gameState.updateState({
            prestigeLevel: s.prestigeLevel + 1,
            prestigeMultiplier: s.prestigeMultiplier + multiplier * 0.1,
            satoshis: 0,
            totalMined: 0,
            totalClicks: 0,
            startTime: Date.now(),
            gpu: { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 },
            cooling: { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 },
            powerSupply: { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 },
            quantumProcessor: { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 },
            automation: { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 },
            altcoins: Object.fromEntries(Object.entries(s.altcoins).map(([k, v]) => [k, { ...v, holdings: 0 }]))
        });
        const nextRequirement = getPrestigeRequirement(s.prestigeLevel + 1);
        showMessage(`⚡ Prestige! +${(multiplier * 0.1).toFixed(1)}x multiplier! Next: ${nextRequirement.toLocaleString()} sats`, 'success');
        updateMiningPower();
        renderUI();
    } else {
        showMessage(`❌ Need ${currentRequirement.toLocaleString()}+ sats to prestige!`, 'error');
    }
} 