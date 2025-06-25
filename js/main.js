// Main entry point for Hash Harvest
// Handles initialization and event listeners
import { loadGame, saveGame, resetGame, openSettings, closeSettings } from './saveLoad.js';
import { openShop, closeShop, buyBoost, claimDailyReward } from './shop.js';
import { updateMiningPower, gameLoop, mine, buyAltcoin, sellAltcoin } from './game.js';
import { buyGpu, buyCooling, buyPowerSupply, buyQuantum, buyAutomation, buyMiningBoost, buyEfficiency, buyLuck } from './upgrades.js';
import { renderUI, showMessage } from './ui.js';
import { doRebirth } from './rebirth.js';
import { doPrestige } from './prestige.js';

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
            // Reset colors
            btn.classList.remove('bg-purple-600', 'bg-orange-600', 'bg-teal-600', 'hover:bg-gray-700');
            btn.classList.add('hover:bg-gray-700'); // re-add default hover
            // Apply active color
            if (i === tabIndex) {
                btn.classList.add(i === 0 ? 'bg-purple-600' : i === 1 ? 'bg-orange-600' : 'bg-teal-600');
                btn.classList.remove('hover:bg-gray-700');
            }
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
    setupTabListeners();
    setupEventListeners();
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

    // Settings modal open/close
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    if (openSettingsBtn) openSettingsBtn.addEventListener('click', openSettings);
    const openSettingsBtnMobile = document.getElementById('openSettingsBtnMobile');
    if (openSettingsBtnMobile) openSettingsBtnMobile.addEventListener('click', openSettings);
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);

    // Shop modal open/close
    const openShopBtn = document.getElementById('openShopBtn');
    if (openShopBtn) openShopBtn.addEventListener('click', openShop);
    const openShopBtnMobile = document.getElementById('openShopBtnMobile');
    if (openShopBtnMobile) openShopBtnMobile.addEventListener('click', openShop);
    const closeShopBtn = document.getElementById('closeShopBtn');
    if (closeShopBtn) closeShopBtn.addEventListener('click', closeShop);

    // Mining Rig Info Popup (mobile)
    const openStatsBtn = document.getElementById('openStatsModalBtn');
    const closeStatsBtn = document.getElementById('closeStatsModalBtn');
    const statsModal = document.getElementById('miningStatsModal');
    if (openStatsBtn && statsModal) {
        openStatsBtn.addEventListener('click', () => {
            // The renderUI function now updates the modal content automatically.
            // This listener just needs to show the modal.
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
            doRebirth();
            rebirthNowButton.classList.remove('shimmer', 'mining-pulse-orange');
            void rebirthNowButton.offsetWidth;
            rebirthNowButton.classList.add('mining-pulse-orange');
            setTimeout(() => {
                rebirthNowButton.classList.remove('mining-pulse-orange');
                rebirthNowButton.classList.add('shimmer');
            }, 800);
        });
    }

    // Prestige Now button animation and logic
    const prestigeNowButton = document.getElementById('prestigeNowButton');
    if (prestigeNowButton) {
        prestigeNowButton.addEventListener('click', () => {
            doPrestige();
            prestigeNowButton.classList.remove('shimmer', 'mining-pulse-blue');
            void prestigeNowButton.offsetWidth;
            prestigeNowButton.classList.add('mining-pulse-blue');
            setTimeout(() => {
                prestigeNowButton.classList.remove('mining-pulse-blue');
                prestigeNowButton.classList.add('shimmer');
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
            closeShop();
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

    // Close shop modal when clicking outside
    const shopModal = document.getElementById('shopModal');
    if (shopModal) {
        shopModal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeShop();
            }
        });
    }
    setupUpgradeListeners();
    setupMarketListeners();
    setupShopListeners();
};

const setupMarketListeners = () => {
    const market = document.getElementById('altcoinMarket');
    if (!market) return;

    market.addEventListener('click', (e) => {
        const button = e.target.closest('button[data-action]');
        if (!button) return;

        const { altcoin, action } = button.dataset;
        let result;

        if (action === 'buy') result = buyAltcoin(altcoin);
        if (action === 'sell') result = sellAltcoin(altcoin);
        if (result) showMessage(result.message, result.success ? 'success' : 'error');
    });
};

const setupShopListeners = () => {
    const shop = document.getElementById('shopItemsContainer');
    if (!shop) return;

    shop.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        // Handle boost purchases
        if (button.dataset.boostType) {
            const { boostType, multiplier, duration, cost } = button.dataset;
            const result = buyBoost(boostType, parseFloat(multiplier), parseInt(duration, 10), parseInt(cost, 10));
            if (result) {
                showMessage(result.message, result.success ? 'success' : 'error');
            }
        }

        // Handle daily reward claim
        if (button.id === 'claimDailyRewardBtn') {
            const result = claimDailyReward();
            if (result) {
                showMessage(result.message, result.success ? 'success' : 'error');
            }
        }
    });
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
        { id: 'buyLuckButton', handler: buyLuck },
        // Mobile + buttons
        { id: 'buyMiningBoostButtonMobile', handler: buyMiningBoost },
        { id: 'buyEfficiencyButtonMobile', handler: buyEfficiency },
        { id: 'buyLuckButtonMobile', handler: buyLuck }
    ];
    rebirths.forEach(({ id, handler }) => {
        const btn = document.getElementById(id);
        if (btn) btn.addEventListener('click', handler);
    });
};
