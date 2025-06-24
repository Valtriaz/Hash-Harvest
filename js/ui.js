import { gameState } from './state.js';
import { getRebirthRequirement, canRebirth } from './rebirth.js';
import { getPrestigeRequirement, canPrestige } from './prestige.js';

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

    // Update mobile stats modal as well
    document.getElementById('modalTotalMined').textContent = `${s.totalMined.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats`;
    document.getElementById('modalTotalClicks').textContent = s.totalClicks.toLocaleString();
    document.getElementById('modalTimePlayed').textContent = `${hours}h ${minutes}m ${seconds}s`;
    document.getElementById('modalPrestigeLevel').textContent = s.prestigeLevel;
    document.getElementById('modalPrestigeMultiplier').textContent = `${s.prestigeMultiplier.toFixed(1)}x`;
    document.getElementById('modalRebirthLevel').textContent = s.rebirthLevel;
    document.getElementById('modalRebirthPoints').textContent = s.rebirthPoints;
    document.getElementById('modalRebirthMultiplier').textContent = `${s.rebirthMultiplier.toFixed(1)}x`;

    // Prestige/Rebirth
    document.getElementById('prestigeLevel').textContent = s.prestigeLevel;
    document.getElementById('prestigeMultiplier').textContent = `${s.prestigeMultiplier.toFixed(1)}x`;
    // Note: Your HTML has duplicate IDs which is invalid. Using querySelectorAll to update all instances.
    document.querySelectorAll('#rebirthLevel').forEach(el => el.textContent = s.rebirthLevel);
    document.querySelectorAll('#rebirthPoints').forEach(el => el.textContent = s.rebirthPoints);
    document.querySelectorAll('#rebirthMultiplier').forEach(el => el.textContent = `${s.rebirthMultiplier.toFixed(1)}x`);
    // Upgrades
    document.getElementById('gpuLevel').textContent = `Level: ${s.gpu.level}`;
    document.getElementById('gpuCost').textContent = `Cost: ${s.gpu.cost.toLocaleString()} sats`;
    document.getElementById('coolingLevel').textContent = `Level: ${s.cooling.level}`;
    document.getElementById('coolingCost').textContent = `Cost: ${s.cooling.cost.toLocaleString()} sats`;
    document.getElementById('powerSupplyLevel').textContent = `Level: ${s.powerSupply.level}`;
    document.getElementById('powerSupplyCost').textContent = `Cost: ${s.powerSupply.cost.toLocaleString()} sats`;
    document.getElementById('quantumLevel').textContent = `Level: ${s.quantumProcessor.level}`;
    document.getElementById('quantumCost').textContent = `Cost: ${s.quantumProcessor.cost.toLocaleString()} sats`;
    document.getElementById('automationLevel').textContent = `Level: ${s.automation.level}`;
    document.getElementById('automationCost').textContent = `Cost: ${s.automation.cost.toLocaleString()} sats`;
    // Mobile upgrades
    document.getElementById('gpuLevelMobile').textContent = `Level: ${s.gpu.level}`;
    document.getElementById('gpuCostMobile').textContent = `Cost: ${s.gpu.cost.toLocaleString()} sats`;
    document.getElementById('coolingLevelMobile').textContent = `Level: ${s.cooling.level}`;
    document.getElementById('coolingCostMobile').textContent = `Cost: ${s.cooling.cost.toLocaleString()} sats`;
    document.getElementById('powerSupplyLevelMobile').textContent = `Level: ${s.powerSupply.level}`;
    document.getElementById('powerSupplyCostMobile').textContent = `Cost: ${s.powerSupply.cost.toLocaleString()} sats`;
    document.getElementById('quantumLevelMobile').textContent = `Level: ${s.quantumProcessor.level}`;
    document.getElementById('quantumCostMobile').textContent = `Cost: ${s.quantumProcessor.cost.toLocaleString()} sats`;
    document.getElementById('automationLevelMobile').textContent = `Level: ${s.automation.level}`;
    document.getElementById('automationCostMobile').textContent = `Cost: ${s.automation.cost.toLocaleString()} sats`;
    // Rebirth upgrades
    document.getElementById('miningBoostLevel').textContent = `Level: ${s.miningBoost.level}`;
    document.getElementById('miningBoostCost').textContent = `Cost: ${s.miningBoost.cost} Rebirth Points`;
    document.getElementById('efficiencyLevel').textContent = `Level: ${s.efficiency.level}`;
    document.getElementById('efficiencyCost').textContent = `Cost: ${s.efficiency.cost} Rebirth Points`;
    document.getElementById('luckLevel').textContent = `Level: ${s.luck.level}`;
    document.getElementById('luckCost').textContent = `Cost: ${s.luck.cost} Rebirth Points`;
    // Mobile Rebirth upgrades
    document.getElementById('miningBoostLevelMobile').textContent = `Level: ${s.miningBoost.level}`;
    document.getElementById('miningBoostCostMobile').textContent = `Cost: ${s.miningBoost.cost} RP`;
    document.getElementById('efficiencyLevelMobile').textContent = `Level: ${s.efficiency.level}`;
    document.getElementById('efficiencyCostMobile').textContent = `Cost: ${s.efficiency.cost} RP`;
    document.getElementById('luckLevelMobile').textContent = `Level: ${s.luck.level}`;
    document.getElementById('luckCostMobile').textContent = `Cost: ${s.luck.cost} RP`;
    // Rebirth System - use currentRebirthNo for all requirements
    const currentRebirthNo = s.rebirthLevel;
    const rebirthRequirementElem = document.getElementById('rebirthRequirement');
    const rebirthNextRequirementElem = document.getElementById('rebirthNextRequirement');
    const rebirthNowButton = document.getElementById('rebirthNowButton');
    const currentRequirement = getRebirthRequirement(currentRebirthNo);
    const nextRequirement = getRebirthRequirement(currentRebirthNo + 1);
    if (rebirthRequirementElem) {
        rebirthRequirementElem.textContent = `Next Rebirth Requirement: ${currentRequirement.toLocaleString()}+ sats`;
    }
    if (rebirthNextRequirementElem) {
        rebirthNextRequirementElem.textContent = `Next: ${nextRequirement.toLocaleString()}+ sats`;
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
    const prestigeNextRequirementElem = document.getElementById('prestigeNextRequirement');
    const prestigeNowButton = document.getElementById('prestigeNowButton');
    const currentPrestigeRequirement = getPrestigeRequirement(currentPrestigeNo);
    const nextPrestigeRequirement = getPrestigeRequirement(currentPrestigeNo + 1);
    if (prestigeRequirementElem) {
        prestigeRequirementElem.textContent = `${currentPrestigeRequirement.toLocaleString(undefined, { notation: 'compact', compactDisplay: 'short' })}+ sats`;
    }
    if (prestigeNowButton) {
        prestigeNowButton.disabled = !canPrestige(s);
    }
    if (prestigeNextRequirementElem) {
        prestigeNextRequirementElem.textContent = `Next: ${nextPrestigeRequirement.toLocaleString()}+ sats`;
    }
    const prestigeProgress = document.getElementById('prestigeProgress');
    if (prestigeProgress) {
        prestigeProgress.textContent = `${s.totalMined.toLocaleString(undefined, { maximumFractionDigits: 0 })} sats`;
        prestigeProgress.classList.toggle('text-green-400', canPrestige(s));
    }
    // Altcoin Market
    renderAltcoinMarket(s);
    // Button states
    updateButtonStates(s);
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
};

export const showMessage = (message, type) => {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-800', 'bg-red-800', 'bg-blue-800', 'border-green-500', 'border-red-500', 'border-blue-500', 'text-green-100', 'text-red-100', 'text-blue-100');
    if (type === 'success') {
        messageBox.classList.add('bg-green-800/90', 'border-green-500', 'text-green-100');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-800/90', 'border-red-500', 'text-red-100');
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
