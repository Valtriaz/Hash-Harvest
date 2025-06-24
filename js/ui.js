// UI Management Functions

function updateUI() {
    const satoshisDisplay = document.getElementById('satoshisDisplay');
    const satoshiRate = document.getElementById('satoshiRate');
    const clickValueDisplay = document.getElementById('clickValueDisplay');
    const totalMinedDisplay = document.getElementById('totalMined');
    const totalClicksDisplay = document.getElementById('totalClicks');
    const timePlayedDisplay = document.getElementById('timePlayed');
    const prestigeLevelDisplay = document.getElementById('prestigeLevel');
    const prestigeMultiplierDisplay = document.getElementById('prestigeMultiplier');
    const rebirthLevelDisplay = document.getElementById('rebirthLevel');
    const rebirthPointsDisplay = document.getElementById('rebirthPoints');
    const rebirthMultiplierDisplay = document.getElementById('rebirthMultiplier');

    satoshisDisplay.textContent = `${satoshis.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats`;
    satoshiRate.textContent = `${miningPowerPerSecond.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats/second`;
    clickValueDisplay.textContent = `Getting ${miningPowerPerClick.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats per click`;

    totalMinedDisplay.textContent = `${totalMined.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats`;
    totalClicksDisplay.textContent = totalClicks.toLocaleString();
    
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const hours = Math.floor(timeElapsed / 3600);
    const minutes = Math.floor((timeElapsed % 3600) / 60);
    const seconds = timeElapsed % 60;
    timePlayedDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;

    // Update upgrade displays
    updateUpgradeDisplays();
    
    // Update rebirth displays
    updateRebirthDisplays();

    prestigeLevelDisplay.textContent = prestigeLevel;
    prestigeMultiplierDisplay.textContent = `${prestigeMultiplier.toFixed(1)}x`;

    rebirthLevelDisplay.textContent = rebirthLevel;
    rebirthPointsDisplay.textContent = rebirthPoints;
    rebirthMultiplierDisplay.textContent = `${rebirthMultiplier.toFixed(1)}x`;

    // Update progress displays
    updateProgressDisplays();

    updateAltcoinMarket();
    checkButtonAvailability();
}

function updateUpgradeDisplays() {
    const gpuLevel = document.getElementById('gpuLevel');
    const gpuCost = document.getElementById('gpuCost');
    const coolingLevel = document.getElementById('coolingLevel');
    const coolingCost = document.getElementById('coolingCost');
    const powerSupplyLevel = document.getElementById('powerSupplyLevel');
    const powerSupplyCost = document.getElementById('powerSupplyCost');
    const quantumLevel = document.getElementById('quantumLevel');
    const quantumCost = document.getElementById('quantumCost');
    const automationLevel = document.getElementById('automationLevel');
    const automationCost = document.getElementById('automationCost');

    gpuLevel.textContent = `Level: ${gpu.level}`;
    gpuCost.textContent = `Cost: ${gpu.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;

    coolingLevel.textContent = `Level: ${cooling.level}`;
    coolingCost.textContent = `Cost: ${cooling.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;

    powerSupplyLevel.textContent = `Level: ${powerSupply.level}`;
    powerSupplyCost.textContent = `Cost: ${powerSupply.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;

    quantumLevel.textContent = `Level: ${quantumProcessor.level}`;
    quantumCost.textContent = `Cost: ${quantumProcessor.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;

    automationLevel.textContent = `Level: ${automation.level}`;
    automationCost.textContent = `Cost: ${automation.cost.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;
}

function updateRebirthDisplays() {
    const miningBoostLevel = document.getElementById('miningBoostLevel');
    const miningBoostCost = document.getElementById('miningBoostCost');
    const efficiencyLevel = document.getElementById('efficiencyLevel');
    const efficiencyCost = document.getElementById('efficiencyCost');
    const luckLevel = document.getElementById('luckLevel');
    const luckCost = document.getElementById('luckCost');

    miningBoostLevel.textContent = `Level: ${miningBoost.level}`;
    miningBoostCost.textContent = `Cost: ${miningBoost.cost} Rebirth Points`;

    efficiencyLevel.textContent = `Level: ${efficiency.level}`;
    efficiencyCost.textContent = `Cost: ${efficiency.cost} Rebirth Points`;

    luckLevel.textContent = `Level: ${luck.level}`;
    luckCost.textContent = `Cost: ${luck.cost} Rebirth Points`;
}

function updateProgressDisplays() {
    // Update rebirth progress
    const rebirthProgressElement = document.getElementById('rebirthProgress');
    const rebirthRequirementElement = document.getElementById('rebirthRequirement');
    if (rebirthProgressElement && rebirthRequirementElement) {
        const currentRequirement = window.getRebirthRequirement(rebirthLevel);
        rebirthProgressElement.textContent = `${totalMined.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;
        rebirthRequirementElement.textContent = `${currentRequirement.toLocaleString()}+ sats`;
        if (totalMined >= currentRequirement) {
            rebirthProgressElement.className = 'text-green-400 font-jetbrains font-bold neon-text';
        } else if (totalMined >= currentRequirement * 0.5) {
            rebirthProgressElement.className = 'text-yellow-400 font-jetbrains font-bold';
        } else {
            rebirthProgressElement.className = 'text-red-400 font-jetbrains font-bold';
        }
    }

    // Update prestige progress
    const prestigeProgressElement = document.getElementById('prestigeProgress');
    const prestigeRequirementElement = document.getElementById('prestigeRequirement');
    if (prestigeProgressElement && prestigeRequirementElement) {
        const prestigeRequirement = 1000000;
        prestigeProgressElement.textContent = `${totalMined.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;
        prestigeRequirementElement.textContent = `${prestigeRequirement.toLocaleString()}+ sats`;
        if (totalMined >= prestigeRequirement) {
            prestigeProgressElement.className = 'text-green-400 font-jetbrains font-bold neon-text';
        } else if (totalMined >= prestigeRequirement * 0.5) {
            prestigeProgressElement.className = 'text-yellow-400 font-jetbrains font-bold';
        } else {
            prestigeProgressElement.className = 'text-red-400 font-jetbrains font-bold';
        }
    }
}

function updateAltcoinMarket() {
    const altcoinMarketDiv = document.getElementById('altcoinMarket');
    altcoinMarketDiv.innerHTML = '';
    
    for (const key in altcoins) {
        const coin = altcoins[key];
        const altcoinCard = document.createElement('div');
        altcoinCard.className = 'bg-gray-800/70 p-5 rounded-xl shadow-lg border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 backdrop-blur-sm';
        
        const colorClass = {
            'orange': 'bg-orange-600',
            'blue': 'bg-blue-600',
            'gray': 'bg-gray-600', 
            'yellow': 'bg-yellow-600',
            'green': 'bg-green-600',
            'purple': 'bg-purple-600'
        }[coin.color] || 'bg-gray-600';
        
        altcoinCard.innerHTML = `
            <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-white font-orbitron">${key}</h3>
                    <p class="text-gray-400 text-sm font-exo">Current Price</p>
                </div>
            </div>
            <p class="text-gray-300 text-sm mb-2 font-exo">Price: <span class="text-yellow-400 font-bold font-jetbrains" id="${key.replace(/\s/g, '')}Price">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sats</span></p>
            <p class="text-gray-300 text-sm mb-4 font-exo">Holdings: <span class="text-blue-400 font-bold font-jetbrains" id="${key.replace(/\s/g, '')}Holdings">${coin.holdings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
            <div class="flex gap-2">
                <button id="buy${key.replace(/\s/g, '')}Button" class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-exo">Buy</button>
                <button id="sell${key.replace(/\s/g, '')}Button" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-exo">Sell</button>
            </div>
        `;
        altcoinMarketDiv.appendChild(altcoinCard);

        document.getElementById(`buy${key.replace(/\s/g, '')}Button`).addEventListener('click', () => buyAltcoin(key));
        document.getElementById(`sell${key.replace(/\s/g, '')}Button`).addEventListener('click', () => sellAltcoin(key));
    }
}

function checkButtonAvailability() {
    const buttons = [
        { button: document.getElementById('buyGpuButton'), cost: gpu.cost },
        { button: document.getElementById('buyCoolingButton'), cost: cooling.cost },
        { button: document.getElementById('buyPowerSupplyButton'), cost: powerSupply.cost },
        { button: document.getElementById('buyQuantumButton'), cost: quantumProcessor.cost },
        { button: document.getElementById('buyAutomationButton'), cost: automation.cost }
    ];

    buttons.forEach(({ button, cost }) => {
        if (button) {
            if (satoshis >= cost) {
                button.classList.remove('disabled-button');
                button.classList.add('enabled-button');
                button.disabled = false;
            } else {
                button.classList.add('disabled-button');
                button.classList.remove('enabled-button');
                button.disabled = true;
            }
        }
    });

    // Check rebirth upgrade buttons
    const rebirthButtons = [
        { button: document.getElementById('buyMiningBoostButton'), cost: miningBoost.cost, points: rebirthPoints },
        { button: document.getElementById('buyEfficiencyButton'), cost: efficiency.cost, points: rebirthPoints },
        { button: document.getElementById('buyLuckButton'), cost: luck.cost, points: rebirthPoints }
    ];

    rebirthButtons.forEach(({ button, cost, points }) => {
        if (button) {
            if (points >= cost) {
                button.classList.remove('disabled-button');
                button.classList.add('enabled-button');
                button.disabled = false;
            } else {
                button.classList.add('disabled-button');
                button.classList.remove('enabled-button');
                button.disabled = true;
            }
        }
    });

    // Check altcoin buttons
    for (const key in altcoins) {
        const buyBtn = document.getElementById(`buy${key.replace(/\s/g, '')}Button`);
        const sellBtn = document.getElementById(`sell${key.replace(/\s/g, '')}Button`);
        
        if (buyBtn) {
            if (satoshis >= altcoins[key].price) {
                buyBtn.classList.remove('disabled-button');
                buyBtn.classList.add('enabled-button');
                buyBtn.disabled = false;
            } else {
                buyBtn.classList.add('disabled-button');
                buyBtn.classList.remove('enabled-button');
                buyBtn.disabled = true;
            }
        }
        
        if (sellBtn) {
            if (altcoins[key].holdings > 0) {
                sellBtn.classList.remove('disabled-button');
                sellBtn.classList.add('enabled-button');
                sellBtn.disabled = false;
            } else {
                sellBtn.classList.add('disabled-button');
                sellBtn.classList.remove('enabled-button');
                sellBtn.disabled = true;
            }
        }
    }
}

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.add('hidden'));
    
    // Remove active state from all tabs
    const tabs = ['rigTab', 'rebirthTab', 'marketTab'];
    tabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        if (tab) {
            tab.classList.remove('bg-purple-600', 'bg-orange-600', 'bg-teal-600', 'text-white');
            tab.classList.add('text-gray-400', 'hover:bg-gray-700');
        }
    });
    
    // Show selected tab content and activate tab
    const contentId = tabName + 'Content';
    const tabId = tabName + 'Tab';
    
    const contentElement = document.getElementById(contentId);
    if (contentElement) {
        contentElement.classList.remove('hidden');
    }
    
    const activeTab = document.getElementById(tabId);
    if (activeTab) {
        activeTab.classList.remove('text-gray-400', 'hover:bg-gray-700');
        
        // Set appropriate color based on tab
        const colors = {
            'rig': 'bg-purple-600',
            'rebirth': 'bg-orange-600', 
            'market': 'bg-teal-600'
        };
        
        activeTab.classList.add(colors[tabName], 'text-white');
    }
} 