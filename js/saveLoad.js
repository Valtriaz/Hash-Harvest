import { gameState } from './state.js';
import { updateMiningPower } from './game.js';
import { renderUI, showMessage } from './ui.js';

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
        // Don't show a message on initial load if no save exists.
        // It's not an error, it's a new game.
    }
}

export function resetGame() {
    if (confirm('⚠️ Are you sure you want to reset the game? This will delete ALL progress including prestige and rebirth levels!')) {
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
