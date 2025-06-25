import { gameState } from './state.js';
import { getRebirthRequirement, canRebirth } from './rebirth.js';
import { getPrestigeRequirement, canPrestige } from './prestige.js';
import { isDailyRewardAvailable, getDailyRewardCooldown } from './shop.js';

// Helper to update text content for all elements matching a selector
const updateText = (selector, text) => {
    document.querySelectorAll(selector).forEach(el => el.textContent = text);
};

// UI rendering functions
export const renderUI = () => {
    const s = gameState.getState();
    // Mining stats
    document.getElementById('satoshisDisplay').textContent = `${s.satoshis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats`;
    document.getElementById('satoshiRate').textContent = `${s.miningPowerPerSecond.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats/second`;
    document.getElementById('clickValueDisplay').textContent = `Getting ${s.miningPowerPerClick.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats per click`;
    document.getElementById('totalMined').textContent = `${s.totalMined.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats`;
    document.getElementById('totalClicks').textContent = s.totalClicks.toLocaleString();
    const timeElapsed = Math.floor((Date.now() - s.startTime) / 1000);
    const hours = Math.floor(timeElapsed / 3600);
    const minutes = Math.floor((timeElapsed % 3600) / 60);
    const seconds = timeElapsed % 60;
    document.getElementById('timePlayed').textContent = `${hours}h ${minutes}m ${seconds}s`;

    // Update gem count in shop
    const gemCountEl = document.getElementById('gemCount');
    if (gemCountEl) {
        gemCountEl.textContent = s.gems.toLocaleString();
    }
    
    // Update mobile stats modal as well
    updateText('.js-total-mined', `${s.totalMined.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats`);
    updateText('.js-total-clicks', s.totalClicks.toLocaleString());
    updateText('.js-time-played', `${hours}h ${minutes}m ${seconds}s`);

    // Prestige/Rebirth Stats (now using classes)
    updateText('.js-prestige-level', s.prestigeLevel);
    updateText('.js-prestige-multiplier', `${s.prestigeMultiplier.toFixed(1)}x`);
    updateText('.js-rebirth-level', s.rebirthLevel);
    updateText('.js-rebirth-points', s.rebirthPoints);
    updateText('.js-rebirth-multiplier', `${s.rebirthMultiplier.toFixed(1)}x`);

    // Rig Upgrades
    updateText('.js-gpu-level', `Level: ${s.gpu.level}`);
    updateText('.js-gpu-cost', `Cost: ${s.gpu.cost.toLocaleString()} sats`);
    updateText('.js-cooling-level', `Level: ${s.cooling.level}`);
    updateText('.js-cooling-cost', `Cost: ${s.cooling.cost.toLocaleString()} sats`);
    updateText('.js-psu-level', `Level: ${s.powerSupply.level}`);
    updateText('.js-psu-cost', `Cost: ${s.powerSupply.cost.toLocaleString()} sats`);
    updateText('.js-quantum-level', `Level: ${s.quantumProcessor.level}`);
    updateText('.js-quantum-cost', `Cost: ${s.quantumProcessor.cost.toLocaleString()} sats`);
    updateText('.js-automation-level', `Level: ${s.automation.level}`);
    updateText('.js-automation-cost', `Cost: ${s.automation.cost.toLocaleString()} sats`);

    // Rebirth Upgrades
    updateText('.js-mining-boost-level', `Level: ${s.miningBoost.level}`);
    updateText('.js-mining-boost-cost', `Cost: ${s.miningBoost.cost} Rebirth Points`);
    updateText('.js-mining-boost-cost-mobile', `Cost: ${s.miningBoost.cost} RP`);
    updateText('.js-efficiency-level', `Level: ${s.efficiency.level}`);
    updateText('.js-efficiency-cost', `Cost: ${s.efficiency.cost} Rebirth Points`);
    updateText('.js-efficiency-cost-mobile', `Cost: ${s.efficiency.cost} RP`);
    updateText('.js-luck-level', `Level: ${s.luck.level}`);
    updateText('.js-luck-cost', `Cost: ${s.luck.cost} Rebirth Points`);
    updateText('.js-luck-cost-mobile', `Cost: ${s.luck.cost} RP`);

    // Rebirth System - use currentRebirthNo for all requirements
    const currentRebirthNo = s.rebirthLevel;
    const rebirthRequirementElem = document.getElementById('rebirthRequirement');
    const rebirthNowButton = document.getElementById('rebirthNowButton');
    const currentRequirement = getRebirthRequirement(currentRebirthNo);
    if (rebirthRequirementElem) {
        rebirthRequirementElem.textContent = `${currentRequirement.toLocaleString()}+ sats`;
    }
    if (rebirthNowButton) {
        rebirthNowButton.disabled = !canRebirth(s);
    }
    const rebirthProgress = document.getElementById('rebirthProgress');
    if (rebirthProgress) {
        rebirthProgress.textContent = `${s.totalMined.toLocaleString(undefined, { maximumFractionDigits: 0 })} sats`;
        rebirthProgress.classList.toggle('text-green-400', canRebirth(s));
    }
    // Prestige System - use currentPrestigeNo for all requirements
    const currentPrestigeNo = s.prestigeLevel;
    const prestigeRequirementElem = document.getElementById('prestigeRequirement');
    const prestigeNowButton = document.getElementById('prestigeNowButton');
    const currentPrestigeRequirement = getPrestigeRequirement(currentPrestigeNo);
    if (prestigeRequirementElem) {
        prestigeRequirementElem.textContent = `${currentPrestigeRequirement.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'short' })}+ sats`;
    }
    const prestigeProgress = document.getElementById('prestigeProgress');
    if (prestigeProgress) {
        prestigeProgress.textContent = `${s.totalMined.toLocaleString(undefined, { maximumFractionDigits: 0 })} sats`;
        prestigeProgress.classList.toggle('text-green-400', canPrestige(s));
    }
    // Altcoin Market
    if (prestigeNowButton) {
        prestigeNowButton.disabled = !canPrestige(s);
    }

    renderAltcoinMarket(s);
    // Button states
    renderActiveBoosts(s);
    renderDailyRewardStatus();
    updateButtonStates(s);
};

const renderDailyRewardStatus = () => {
    const button = document.getElementById('claimDailyRewardBtn');
    const statusText = document.getElementById('dailyRewardStatus');
    if (!button || !statusText) return;

    if (isDailyRewardAvailable()) {
        button.disabled = false;
        button.textContent = 'Claim Now!';
        button.classList.remove('disabled-button');
        button.classList.add('enabled-button', 'bg-yellow-500', 'hover:bg-yellow-600');
        statusText.textContent = 'Your daily reward is ready!';
    } else {
        const cooldown = getDailyRewardCooldown();
        const hours = Math.floor(cooldown / (1000 * 60 * 60));
        const minutes = Math.floor((cooldown % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((cooldown % (1000 * 60)) / 1000);

        // Ensure button text updates even if the tab is inactive for a while
        const updateTimer = () => {
            const remaining = getDailyRewardCooldown();
            if (remaining <= 0) {
                renderDailyRewardStatus(); // Re-render to show "Claim Now"
            } else {
                const h = Math.floor(remaining / (1000 * 60 * 60));
                const m = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((remaining % (1000 * 60)) / 1000);
                button.textContent = `Claim in ${h}h ${m}m ${s}s`;
            }
        };

        button.disabled = true;
        updateTimer(); // Initial call
        button.classList.add('disabled-button');
        button.classList.remove('enabled-button', 'bg-yellow-500', 'hover:bg-yellow-600');
        statusText.textContent = 'Come back later for your reward.';
    }
};

const renderActiveBoosts = (s) => {
    const container = document.getElementById('activeBoosts');
    if (!container) return;

    container.innerHTML = ''; // Clear previous boosts

    if (s.boosts.satoshiBoost.expiresAt > Date.now()) {
        const timeLeft = Math.ceil((s.boosts.satoshiBoost.expiresAt - Date.now()) / 1000);
        const minutes = Math.floor(timeLeft / 60);
        const seconds = String(timeLeft % 60).padStart(2, '0');
        const boostEl = document.createElement('div');
        boostEl.className = 'text-cyan-400 font-semibold animate-pulse flex items-center justify-center gap-1';
        boostEl.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd"></path></svg>
            <span>${s.boosts.satoshiBoost.multiplier}x Sats Boost: ${minutes}:${seconds}</span>
        `;
        container.appendChild(boostEl);
    }
};

const renderAltcoinMarket = (s) => {
    const altcoinMarketDiv = document.getElementById('altcoinMarket');
    if (!altcoinMarketDiv) return;
    altcoinMarketDiv.innerHTML = '';
    for (const key in s.altcoins) {
        const coin = s.altcoins[key];
        const altcoinCard = document.createElement('div');
        altcoinCard.className = 'altcoin-card';
        const colorClass = {
            'orange': 'bg-orange-600',
            'blue': 'bg-blue-600',
            'gray': 'bg-gray-600',
            'yellow': 'bg-yellow-600',
            'green': 'bg-green-600',
            'purple': 'bg-purple-600'
        }[coin.color] || 'bg-gray-600';
        altcoinCard.innerHTML = `
            <div class="altcoin-header">
                <div class="altcoin-icon ${colorClass}">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div>
                    <div class="altcoin-title">${key}</div>
                    <div class="altcoin-sub">Current Price</div>
                </div>
            </div>
            <div class="altcoin-info">
                <div class="flex items-center mb-1">
                    <span class="altcoin-label">Price:</span>
                    <span class="altcoin-value altcoin-price">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats</span>
                </div>
                <div class="flex items-center">
                    <span class="altcoin-label">Holdings:</span>
                    <span class="altcoin-value altcoin-holdings">${coin.holdings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>
            <div class="altcoin-actions">
                <button class="btn bg-green-600 hover:bg-green-700 text-white" data-altcoin="${key}" data-action="buy" aria-label="Buy ${key}">Buy</button>
                <button class="btn bg-red-600 hover:bg-red-700 text-white" data-altcoin="${key}" data-action="sell" aria-label="Sell ${key}">Sell</button>
            </div>
        `;
        altcoinMarketDiv.appendChild(altcoinCard);
    }
};

const updateButtonStates = (s) => {
    const upgrades = [
        { id: 'buyGpuButton', cost: s.gpu.cost },
        { id: 'buyCoolingButton', cost: s.cooling.cost },
        { id: 'buyPowerSupplyButton', cost: s.powerSupply.cost },
        { id: 'buyQuantumButton', cost: s.quantumProcessor.cost },
        { id: 'buyAutomationButton', cost: s.automation.cost },
        // Mobile + buttons
        { id: 'buyGpuButtonMobile', cost: s.gpu.cost },
        { id: 'buyCoolingButtonMobile', cost: s.cooling.cost },
        { id: 'buyPowerSupplyButtonMobile', cost: s.powerSupply.cost },
        { id: 'buyQuantumButtonMobile', cost: s.quantumProcessor.cost },
        { id: 'buyAutomationButtonMobile', cost: s.automation.cost }
    ];
    upgrades.forEach(({ id, cost }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = s.satoshis < cost;
            btn.classList.toggle('disabled-button', s.satoshis < cost);
            btn.classList.toggle('enabled-button', s.satoshis >= cost);
        }
    });
    const rebirths = [
        { id: 'buyMiningBoostButton', cost: s.miningBoost.cost },
        { id: 'buyEfficiencyButton', cost: s.efficiency.cost },
        { id: 'buyLuckButton', cost: s.luck.cost },
        // Mobile + buttons
        { id: 'buyMiningBoostButtonMobile', cost: s.miningBoost.cost },
        { id: 'buyEfficiencyButtonMobile', cost: s.efficiency.cost },
        { id: 'buyLuckButtonMobile', cost: s.luck.cost }
    ];
    rebirths.forEach(({ id, cost }) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.disabled = s.rebirthPoints < cost;
            btn.classList.toggle('disabled-button', s.rebirthPoints < cost);
            btn.classList.toggle('enabled-button', s.rebirthPoints >= cost);
        }
    });

    // Rebirth and Prestige buttons
    const rebirthNowButton = document.getElementById('rebirthNowButton');
    if (rebirthNowButton) {
        rebirthNowButton.classList.toggle('disabled-button', !canRebirth(s));
        rebirthNowButton.classList.toggle('enabled-button', canRebirth(s));
    }
    const prestigeNowButton = document.getElementById('prestigeNowButton');
    if (prestigeNowButton) {
        prestigeNowButton.classList.toggle('disabled-button', !canPrestige(s));
        prestigeNowButton.classList.toggle('enabled-button', canPrestige(s));
    }
};

export const showMessage = (message, type) => {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-800', 'bg-red-800', 'bg-blue-800', 'border-green-500', 'border-red-500', 'border-blue-500', 'text-green-100', 'text-red-100', 'text-blue-100');
    if (type === 'success') {
        messageBox.classList.add('bg-green-800/90', 'border-green-500', 'text-green-100');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-800/90', 'border-red-500', 'text-red-100');
    } else if (type === 'info') {
        messageBox.classList.add('bg-sky-800/90', 'border-sky-500', 'text-sky-100');
    } else {
        messageBox.classList.add('bg-blue-800/90', 'border-blue-500', 'text-blue-100');
    }
    messageBox.style.transform = 'translateX(-50%) translateY(-100%)';
    messageBox.style.opacity = '0';
    setTimeout(() => {
        messageBox.style.transform = 'translateX(-50%) translateY(0)';
        messageBox.style.opacity = '1';
    }, 10);
    setTimeout(() => {
        messageBox.style.transform = 'translateX(-50%) translateY(-100%)';
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300);
    }, 3000);
};

gameState.subscribe(renderUI);
