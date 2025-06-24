// Main entry point for Mining Mania
// Handles initialization and event listeners
import { loadGame, saveGame, prestige, rebirth, resetGame, openSettings, closeSettings } from './saveLoad.js';
import { updateMiningPower, gameLoop, mine, getRebirthRequirement } from './game.js';
import { buyGpu, buyCooling, buyPowerSupply, buyQuantum, buyAutomation, buyMiningBoost, buyEfficiency, buyLuck } from './upgrades.js';
import { gameState } from './state.js';
import { renderUI, showMessage } from './ui.js';
import { doRebirth } from './rebirth.js';

window.getRebirthRequirement = getRebirthRequirement;

// --- Tab Switching Logic ---
function switchTabSlider(tabIndex) {
    const tabButtons = [
        document.getElementById('rigTab'),
        document.getElementById('rebirthTab'),
        document.getElementById('marketTab')
    ];
    const tabContents = [
        document.getElementById('rigContent'),
        document.getElementById('rebirthContent'),
        document.getElementById('marketContent')
    ];
    tabButtons.forEach((btn, i) => {
        if (btn) {
            btn.setAttribute('aria-selected', i === tabIndex ? 'true' : 'false');
            btn.tabIndex = i === tabIndex ? 0 : -1;
            btn.classList.toggle('bg-purple-600', i === tabIndex && i === 0);
            btn.classList.toggle('bg-orange-600', i === tabIndex && i === 1);
            btn.classList.toggle('bg-teal-600', i === tabIndex && i === 2);
            btn.classList.toggle('text-white', i === tabIndex);
            btn.classList.toggle('text-gray-400', i !== tabIndex);
        }
    });
    tabContents.forEach((content, i) => {
        if (content) {
            content.classList.toggle('hidden', i !== tabIndex);
        }
    });
}

function setupTabListeners() {
    const tabButtons = [
        document.getElementById('rigTab'),
        document.getElementById('rebirthTab'),
        document.getElementById('marketTab')
    ];
    tabButtons.forEach((btn, i) => {
        if (btn) {
            btn.addEventListener('click', () => switchTabSlider(i));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = (i + 1) % tabButtons.length;
                    tabButtons[next].focus();
                    switchTabSlider(next);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = (i - 1 + tabButtons.length) % tabButtons.length;
                    tabButtons[prev].focus();
                    switchTabSlider(prev);
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    tabButtons[0].focus();
                    switchTabSlider(0);
                } else if (e.key === 'End') {
                    e.preventDefault();
                    tabButtons[tabButtons.length - 1].focus();
                    switchTabSlider(tabButtons.length - 1);
                }
            });
        }
    });
    // Initialize first tab
    switchTabSlider(0);
}

window.onload = () => {
    loadGame();
    updateMiningPower();
    renderUI();
    setInterval(gameLoop, 1000);
    setupEventListeners();
    setupTabListeners();
    setupSettingsToggles();
};

const setupEventListeners = () => {
    // Mining button
    const mineButton = document.getElementById('mineButton');
    if (mineButton) mineButton.addEventListener('click', mine);

    // Save/Load/Reset buttons in settings
    const saveBtn = document.getElementById('saveGameBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveGame);
    const loadBtn = document.getElementById('loadGameBtn');
    if (loadBtn) loadBtn.addEventListener('click', loadGame);
    const resetBtn = document.getElementById('resetGameBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetGame);

    // Mining Rig Info Popup (mobile)
    const openStatsBtn = document.getElementById('openStatsModalBtn');
    const closeStatsBtn = document.getElementById('closeStatsModalBtn');
    const statsModal = document.getElementById('miningStatsModal');
    if (openStatsBtn && statsModal) {
        openStatsBtn.addEventListener('click', () => {
            // Update modal stats
            const s = gameState.getState();
            document.getElementById('modalTotalMined').textContent = `${s.totalMined.toLocaleString()} sats`;
            document.getElementById('modalTotalClicks').textContent = s.totalClicks.toLocaleString();
            const timeElapsed = Math.floor((Date.now() - s.startTime) / 1000);
            const hours = Math.floor(timeElapsed / 3600);
            const minutes = Math.floor((timeElapsed % 3600) / 60);
            const seconds = timeElapsed % 60;
            document.getElementById('modalTimePlayed').textContent = `${hours}h ${minutes}m ${seconds}s`;
            document.getElementById('modalPrestigeLevel').textContent = s.prestigeLevel;
            statsModal.classList.remove('hidden');
        });
    }
    if (closeStatsBtn && statsModal) {
        closeStatsBtn.addEventListener('click', () => {
            statsModal.classList.add('hidden');
        });
    }
    // Close modal when clicking backdrop
    if (statsModal) {
        statsModal.addEventListener('click', function(event) {
            if (event.target === this) {
                statsModal.classList.add('hidden');
            }
        });
    }

    // Rebirth Now button animation and logic
    const rebirthNowButton = document.getElementById('rebirthNowButton');
    if (rebirthNowButton) {
        rebirthNowButton.addEventListener('click', () => {
            doRebirth(); // Actually perform rebirth
            rebirthNowButton.classList.remove('shimmer', 'mining-pulse-orange');
            void rebirthNowButton.offsetWidth;
            rebirthNowButton.classList.add('mining-pulse-orange');
            setTimeout(() => {
                rebirthNowButton.classList.remove('mining-pulse-orange');
                rebirthNowButton.classList.add('shimmer');
            }, 800);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            mine();
        }
        if (event.code === 'Escape') {
            closeSettings();
        }
    });

    // Close settings modal when clicking outside
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeSettings();
            }
        });
    }

    setupUpgradeListeners();
};

const setupUpgradeListeners = () => {
    // Rig upgrades
    const upgrades = [
        { id: 'buyGpuButton', handler: buyGpu },
        { id: 'buyCoolingButton', handler: buyCooling },
        { id: 'buyPowerSupplyButton', handler: buyPowerSupply },
        { id: 'buyQuantumButton', handler: buyQuantum },
        { id: 'buyAutomationButton', handler: buyAutomation },
        // Mobile + buttons
        { id: 'buyGpuButtonMobile', handler: buyGpu },
        { id: 'buyCoolingButtonMobile', handler: buyCooling },
        { id: 'buyPowerSupplyButtonMobile', handler: buyPowerSupply },
        { id: 'buyQuantumButtonMobile', handler: buyQuantum },
        { id: 'buyAutomationButtonMobile', handler: buyAutomation }
    ];
    upgrades.forEach(({ id, handler }) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', handler);
    });

    // Rebirth upgrades
    const rebirths = [
        { id: 'buyMiningBoostButton', handler: buyMiningBoost },
        { id: 'buyEfficiencyButton', handler: buyEfficiency },
        { id: 'buyLuckButton', handler: buyLuck }
    ];
    rebirths.forEach(({ id, handler }) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', handler);
    });
};

function setupSettingsToggles() {
    // Mute Sounds
    const muteToggle = document.getElementById('muteSoundsToggle');
    const muteKey = 'miningManiaMuteSounds';
    if (muteToggle) {
        // Load from storage
        muteToggle.checked = localStorage.getItem(muteKey) === 'true';
        muteToggle.addEventListener('change', () => {
            localStorage.setItem(muteKey, muteToggle.checked);
            // Future: trigger mute/unmute logic here
        });
    }
    // Animations
    const animToggle = document.getElementById('animationsToggle');
    const animKey = 'miningManiaAnimations';
    if (animToggle) {
        // Load from storage
        const enabled = localStorage.getItem(animKey);
        animToggle.checked = enabled !== 'false'; // default ON
        document.body.classList.toggle('no-animations', !animToggle.checked);
        animToggle.addEventListener('change', () => {
            localStorage.setItem(animKey, animToggle.checked);
            document.body.classList.toggle('no-animations', !animToggle.checked);
        });
    }
}

window.openSettings = openSettings;
window.closeSettings = closeSettings; 