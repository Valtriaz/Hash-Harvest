import { gameState } from './state.js';
import { updateMiningPower } from './game.js';
import { renderUI, showMessage } from './ui.js';
import { doRebirth } from './rebirth.js';

// Save/Load Functions

export function saveGame() {
    const state = gameState.getState();
    localStorage.setItem('miningManiaSave', JSON.stringify(state));
    showMessage('💾 Game Saved Successfully!', 'success');
}

export function loadGame() {
    const savedState = localStorage.getItem('miningManiaSave');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            gameState.loadState(state);
            updateMiningPower();
            renderUI();
            showMessage('📂 Game Loaded Successfully!', 'success');
        } catch (error) {
            showMessage('❌ Error loading game data! Save will be reset.', 'error');
            localStorage.removeItem('miningManiaSave');
            setTimeout(() => location.reload(), 1500);
        }
    } else {
        showMessage('❌ No saved game found!', 'error');
    }
}

export function prestige() {
    const s = gameState.getState();
    if (s.totalMined >= 1_000_000) {
        const multiplier = Math.floor(s.totalMined / 1_000_000);
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
        showMessage(`⚡ Prestige! +${(multiplier * 0.1).toFixed(1)}x multiplier!`, 'success');
        updateMiningPower();
    } else {
        showMessage('❌ Need 1,000,000+ sats to prestige!', 'error');
    }
}

export { doRebirth as rebirth };

export function resetGame() {
    if (confirm('⚠️ Are you sure you want to reset the game? This will delete ALL progress including prestige levels!')) {
        gameState.resetState();
        localStorage.removeItem('miningManiaSave');
        showMessage('🔄 Game reset successfully!', 'success');
        updateMiningPower();
        renderUI();
    }
}

// Settings Modal Functions

export function openSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('hidden');
}

export function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('hidden');
} 