// Game State Variables
let satoshis = 0;
let miningPowerPerClick = 1;
let miningPowerPerSecond = 0;
let totalMined = 0;
let totalClicks = 0;
let startTime = Date.now();
let prestigeLevel = 0;
let prestigeMultiplier = 1;
let rebirthLevel = 0;
let rebirthMultiplier = 1;
let rebirthPoints = 0;

// Upgrade Levels and Costs
let gpu = { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 };
let cooling = { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 };
let powerSupply = { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 };
let quantumProcessor = { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 };
let automation = { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 };

// Rebirth Upgrades
let miningBoost = { level: 0, cost: 1, boost: 0.1, multiplier: 1.2 };
let efficiency = { level: 0, cost: 2, boost: 0.05, multiplier: 1.3 };
let luck = { level: 0, cost: 3, boost: 0.03, multiplier: 1.4 };

// Altcoin Market State
const altcoins = {
    'Bitcoin': { price: 500, holdings: 0, volatility: 0.05, color: 'orange' },
    'Ethereum': { price: 150, holdings: 0, volatility: 0.08, color: 'blue' },
    'Litecoin': { price: 25, holdings: 0, volatility: 0.12, color: 'gray' },
    'Dogecoin': { price: 0.8, holdings: 0, volatility: 0.25, color: 'yellow' },
    'Cardano': { price: 35, holdings: 0, volatility: 0.15, color: 'green' },
    'Solana': { price: 80, holdings: 0, volatility: 0.18, color: 'purple' }
};

// DOM Elements
const satoshisDisplay = document.getElementById('satoshisDisplay');
const satoshiRate = document.getElementById('satoshiRate');
const clickValueDisplay = document.getElementById('clickValueDisplay');
const mineButton = document.getElementById('mineButton');
const messageBox = document.getElementById('messageBox');
const totalMinedDisplay = document.getElementById('totalMined');
const totalClicksDisplay = document.getElementById('totalClicks');
const timePlayedDisplay = document.getElementById('timePlayed');
const prestigeLevelDisplay = document.getElementById('prestigeLevel');
const prestigeMultiplierDisplay = document.getElementById('prestigeMultiplier');
const rebirthLevelDisplay = document.getElementById('rebirthLevel');
const rebirthPointsDisplay = document.getElementById('rebirthPoints');
const rebirthMultiplierDisplay = document.getElementById('rebirthMultiplier');

// Upgrade Buttons and Displays
const gpuLevel = document.getElementById('gpuLevel');
const gpuCost = document.getElementById('gpuCost');
const buyGpuButton = document.getElementById('buyGpuButton');

const coolingLevel = document.getElementById('coolingLevel');
const coolingCost = document.getElementById('coolingCost');
const buyCoolingButton = document.getElementById('buyCoolingButton');

const powerSupplyLevel = document.getElementById('powerSupplyLevel');
const powerSupplyCost = document.getElementById('powerSupplyCost');
const buyPowerSupplyButton = document.getElementById('buyPowerSupplyButton');

const quantumLevel = document.getElementById('quantumLevel');
const quantumCost = document.getElementById('quantumCost');
const buyQuantumButton = document.getElementById('buyQuantumButton');

const automationLevel = document.getElementById('automationLevel');
const automationCost = document.getElementById('automationCost');
const buyAutomationButton = document.getElementById('buyAutomationButton');

// Rebirth Upgrade Buttons and Displays
const miningBoostLevel = document.getElementById('miningBoostLevel');
const miningBoostCost = document.getElementById('miningBoostCost');
const buyMiningBoostButton = document.getElementById('buyMiningBoostButton');

const efficiencyLevel = document.getElementById('efficiencyLevel');
const efficiencyCost = document.getElementById('efficiencyCost');
const buyEfficiencyButton = document.getElementById('buyEfficiencyButton');

const luckLevel = document.getElementById('luckLevel');
const luckCost = document.getElementById('luckCost');
const buyLuckButton = document.getElementById('buyLuckButton');

const altcoinMarketDiv = document.getElementById('altcoinMarket');

// --- Core Game Functions ---

function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-800', 'bg-red-800', 'bg-blue-800', 'border-green-500', 'border-red-500', 'border-blue-500', 'text-green-100', 'text-red-100', 'text-blue-100');
    
    // Add slide-in animation
    messageBox.style.transform = 'translateX(-50%) translateY(-100%)';
    messageBox.style.opacity = '0';
    
    if (type === 'success') {
        messageBox.classList.add('bg-green-800/90', 'border-green-500', 'text-green-100');
    } else if (type === 'error') {
        messageBox.classList.add('bg-red-800/90', 'border-red-500', 'text-red-100');
    } else {
        messageBox.classList.add('bg-blue-800/90', 'border-blue-500', 'text-blue-100');
    }
    
    // Animate in
    setTimeout(() => {
        messageBox.style.transform = 'translateX(-50%) translateY(0)';
        messageBox.style.opacity = '1';
    }, 10);
    
    // Auto-hide after 3 seconds with slide-out animation
    setTimeout(() => {
        messageBox.style.transform = 'translateX(-50%) translateY(-100%)';
        messageBox.style.opacity = '0';
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300);
    }, 3000);
}

function updateMiningPower() {
    // Base mining power from GPU level
    miningPowerPerClick = gpu.level * gpu.baseClick;
    miningPowerPerSecond = gpu.level * gpu.baseIdle;

    // Apply cooling efficiency
    miningPowerPerClick *= (1 + cooling.level * cooling.efficiencyBoost);
    miningPowerPerSecond *= (1 + cooling.level * cooling.efficiencyBoost);

    // Apply quantum processor boost
    miningPowerPerClick *= (1 + quantumProcessor.level * quantumProcessor.megaBoost);
    miningPowerPerSecond *= (1 + quantumProcessor.level * quantumProcessor.megaBoost);

    // Apply automation auto-clicking
    miningPowerPerSecond += automation.level * automation.autoClickRate * miningPowerPerClick;

    // Apply prestige multiplier
    miningPowerPerClick *= prestigeMultiplier;
    miningPowerPerSecond *= prestigeMultiplier;

    // Apply rebirth multiplier
    miningPowerPerClick *= rebirthMultiplier;
    miningPowerPerSecond *= rebirthMultiplier;

    // Apply rebirth upgrades
    miningPowerPerClick *= (1 + miningBoost.level * miningBoost.boost);
    miningPowerPerSecond *= (1 + miningBoost.level * miningBoost.boost);

    // Round to reasonable numbers
    miningPowerPerClick = Math.round(miningPowerPerClick * 100) / 100;
    miningPowerPerSecond = Math.round(miningPowerPerSecond * 100) / 100;

    updateUI();
}

function updateUI() {
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

    // Rebirth upgrades
    miningBoostLevel.textContent = `Level: ${miningBoost.level}`;
    miningBoostCost.textContent = `Cost: ${miningBoost.cost} Rebirth Points`;

    efficiencyLevel.textContent = `Level: ${efficiency.level}`;
    efficiencyCost.textContent = `Cost: ${efficiency.cost} Rebirth Points`;

    luckLevel.textContent = `Level: ${luck.level}`;
    luckCost.textContent = `Cost: ${luck.cost} Rebirth Points`;

    prestigeLevelDisplay.textContent = prestigeLevel;
    prestigeMultiplierDisplay.textContent = `${prestigeMultiplier.toFixed(1)}x`;

    rebirthLevelDisplay.textContent = rebirthLevel;
    rebirthPointsDisplay.textContent = rebirthPoints;
    rebirthMultiplierDisplay.textContent = `${rebirthMultiplier.toFixed(1)}x`;

    // Update rebirth progress
    const rebirthProgressElement = document.getElementById('rebirthProgress');
    const rebirthRequirementElement = document.getElementById('rebirthRequirement');
    if (rebirthProgressElement && rebirthRequirementElement) {
        // Progressive rebirth requirements
        const rebirthRequirements = [100000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];
        const currentRequirement = rebirthRequirements[Math.min(rebirthLevel, rebirthRequirements.length - 1)];
        
        rebirthProgressElement.textContent = `${totalMined.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} sats`;
        rebirthRequirementElement.textContent = `${currentRequirement.toLocaleString()}+ sats`;
        
        // Change color based on progress
        if (totalMined >= currentRequirement) {
            rebirthProgressElement.className = 'text-green-400 font-jetbrains font-bold neon-text';
        } else if (totalMined >= currentRequirement * 0.5) {
            rebirthProgressElement.className = 'text-yellow-400 font-jetbrains font-bold';
        } else {
            rebirthProgressElement.className = 'text-red-400 font-jetbrains font-bold';
        }
    }

    // Update prestige progress (for the new button)
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

    updateAltcoinMarket();
    checkButtonAvailability();
}

function updateAltcoinMarket() {
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
        { button: buyGpuButton, cost: gpu.cost },
        { button: buyCoolingButton, cost: cooling.cost },
        { button: buyPowerSupplyButton, cost: powerSupply.cost },
        { button: buyQuantumButton, cost: quantumProcessor.cost },
        { button: buyAutomationButton, cost: automation.cost }
    ];

    buttons.forEach(({ button, cost }) => {
        if (satoshis >= cost) {
            button.classList.remove('disabled-button');
            button.classList.add('enabled-button');
            button.disabled = false;
        } else {
            button.classList.add('disabled-button');
            button.classList.remove('enabled-button');
            button.disabled = true;
        }
    });

    // Check rebirth upgrade buttons
    const rebirthButtons = [
        { button: buyMiningBoostButton, cost: miningBoost.cost, points: rebirthPoints },
        { button: buyEfficiencyButton, cost: efficiency.cost, points: rebirthPoints },
        { button: buyLuckButton, cost: luck.cost, points: rebirthPoints }
    ];

    rebirthButtons.forEach(({ button, cost, points }) => {
        if (points >= cost) {
            button.classList.remove('disabled-button');
            button.classList.add('enabled-button');
            button.disabled = false;
        } else {
            button.classList.add('disabled-button');
            button.classList.remove('enabled-button');
            button.disabled = true;
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

// --- Upgrade Functions ---

function buyGpu() {
    if (satoshis >= gpu.cost) {
        satoshis -= gpu.cost;
        gpu.level++;
        gpu.cost = Math.floor(gpu.cost * gpu.multiplier);
        showMessage(`🚀 GPU upgraded to Level ${gpu.level}!`, 'success');
        buyGpuButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyGpuButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough sats for GPU upgrade!', 'error');
    }
}

function buyCooling() {
    if (satoshis >= cooling.cost) {
        satoshis -= cooling.cost;
        cooling.level++;
        cooling.cost = Math.floor(cooling.cost * cooling.multiplier);
        showMessage(`❄️ Cooling System upgraded to Level ${cooling.level}!`, 'success');
        buyCoolingButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyCoolingButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough sats for Cooling System upgrade!', 'error');
    }
}

function buyPowerSupply() {
    if (satoshis >= powerSupply.cost) {
        satoshis -= powerSupply.cost;
        powerSupply.level++;
        powerSupply.cost = Math.floor(powerSupply.cost * powerSupply.multiplier);
        showMessage(`⚡ Power Supply upgraded to Level ${powerSupply.level}!`, 'success');
        buyPowerSupplyButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyPowerSupplyButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough sats for Power Supply upgrade!', 'error');
    }
}

function buyQuantum() {
    if (satoshis >= quantumProcessor.cost) {
        satoshis -= quantumProcessor.cost;
        quantumProcessor.level++;
        quantumProcessor.cost = Math.floor(quantumProcessor.cost * quantumProcessor.multiplier);
        showMessage(`🔬 Quantum Processor researched! Level ${quantumProcessor.level}!`, 'success');
        buyQuantumButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyQuantumButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough sats for Quantum Processor research!', 'error');
    }
}

function buyAutomation() {
    if (satoshis >= automation.cost) {
        satoshis -= automation.cost;
        automation.level++;
        automation.cost = Math.floor(automation.cost * automation.multiplier);
        showMessage(`🤖 Mining Automation researched! Level ${automation.level}!`, 'success');
        buyAutomationButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyAutomationButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough sats for Mining Automation research!', 'error');
    }
}

// --- Rebirth Upgrade Functions ---

function buyMiningBoost() {
    if (rebirthPoints >= miningBoost.cost) {
        rebirthPoints -= miningBoost.cost;
        miningBoost.level++;
        miningBoost.cost = Math.floor(miningBoost.cost * miningBoost.multiplier);
        showMessage(`🚀 Mining Boost upgraded to Level ${miningBoost.level}!`, 'success');
        buyMiningBoostButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyMiningBoostButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough Rebirth Points for Mining Boost upgrade!', 'error');
    }
}

function buyEfficiency() {
    if (rebirthPoints >= efficiency.cost) {
        rebirthPoints -= efficiency.cost;
        efficiency.level++;
        efficiency.cost = Math.floor(efficiency.cost * efficiency.multiplier);
        showMessage(`⚡ Efficiency upgraded to Level ${efficiency.level}!`, 'success');
        buyEfficiencyButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyEfficiencyButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough Rebirth Points for Efficiency upgrade!', 'error');
    }
}

function buyLuck() {
    if (rebirthPoints >= luck.cost) {
        rebirthPoints -= luck.cost;
        luck.level++;
        luck.cost = Math.floor(luck.cost * luck.multiplier);
        showMessage(`🍀 Luck upgraded to Level ${luck.level}!`, 'success');
        buyLuckButton.parentElement.classList.add('upgrade-glow');
        setTimeout(() => buyLuckButton.parentElement.classList.remove('upgrade-glow'), 800);
        updateMiningPower();
    } else {
        showMessage('❌ Not enough Rebirth Points for Luck upgrade!', 'error');
    }
}

// --- Altcoin Market Functions ---

function fluctuatePrices() {
    for (const key in altcoins) {
        const coin = altcoins[key];
        const change = coin.price * (Math.random() * 2 * coin.volatility - coin.volatility);
        coin.price = Math.max(0.01, coin.price + change);
    }
    updateUI();
}

function buyAltcoin(coinName) {
    const coin = altcoins[coinName];
    if (satoshis >= coin.price) {
        satoshis -= coin.price;
        coin.holdings += 1;
        showMessage(`📈 Bought 1 ${coinName}!`, 'success');
        updateUI();
    } else {
        showMessage(`❌ Not enough sats to buy 1 ${coinName}!`, 'error');
    }
}

function sellAltcoin(coinName) {
    const coin = altcoins[coinName];
    if (coin.holdings > 0) {
        satoshis += coin.price;
        coin.holdings -= 1;
        showMessage(`📉 Sold 1 ${coinName}!`, 'success');
        updateUI();
    } else {
        showMessage(`❌ No ${coinName} to sell!`, 'error');
    }
}

// --- Game Loop ---

function gameLoop() {
    satoshis += miningPowerPerSecond;
    totalMined += miningPowerPerSecond;
    fluctuatePrices();
    updateUI();
}

// --- Save/Load Functions ---

function saveGame() {
    const gameState = {
        satoshis,
        miningPowerPerClick,
        miningPowerPerSecond,
        totalMined,
        totalClicks,
        startTime,
        gpu,
        cooling,
        powerSupply,
        quantumProcessor,
        automation,
        altcoins,
        prestigeLevel,
        prestigeMultiplier,
        rebirthLevel,
        rebirthMultiplier,
        rebirthPoints,
        miningBoost,
        efficiency,
        luck
    };
    localStorage.setItem('miningManiaSave', JSON.stringify(gameState));
    showMessage('💾 Game Saved Successfully!', 'success');
}

function loadGame() {
    const savedState = localStorage.getItem('miningManiaSave');
    if (savedState) {
        try {
            const gameState = JSON.parse(savedState);
            satoshis = gameState.satoshis || 0;
            miningPowerPerClick = gameState.miningPowerPerClick || 1;
            miningPowerPerSecond = gameState.miningPowerPerSecond || 0;
            totalMined = gameState.totalMined || 0;
            totalClicks = gameState.totalClicks || 0;
            startTime = gameState.startTime || Date.now();
            gpu = gameState.gpu || { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 };
            cooling = gameState.cooling || { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 };
            powerSupply = gameState.powerSupply || { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 };
            quantumProcessor = gameState.quantumProcessor || { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 };
            automation = gameState.automation || { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 };
            
            if (gameState.altcoins) {
                Object.assign(altcoins, gameState.altcoins);
            }
            
            prestigeLevel = gameState.prestigeLevel || 0;
            prestigeMultiplier = gameState.prestigeMultiplier || 1;
            rebirthLevel = gameState.rebirthLevel || 0;
            rebirthMultiplier = gameState.rebirthMultiplier || 1;
            rebirthPoints = gameState.rebirthPoints || 0;
            
            miningBoost = gameState.miningBoost || { level: 0, cost: 1, boost: 0.1, multiplier: 1.2 };
            efficiency = gameState.efficiency || { level: 0, cost: 2, boost: 0.05, multiplier: 1.3 };
            luck = gameState.luck || { level: 0, cost: 3, boost: 0.03, multiplier: 1.4 };
            
            updateMiningPower();
            updateUI();
            showMessage('📂 Game Loaded Successfully!', 'success');
        } catch (error) {
            showMessage('❌ Error loading game data!', 'error');
        }
    } else {
        showMessage('❌ No saved game found!', 'error');
    }
}

function prestige() {
    if (totalMined >= 1000000) {
        const multiplier = Math.floor(totalMined / 1000000);
        prestigeLevel++;
        prestigeMultiplier += multiplier * 0.1;
        
        // Reset game but keep prestige benefits
        satoshis = 0;
        totalMined = 0;
        totalClicks = 0;
        startTime = Date.now();
        
        // Reset upgrades
        gpu = { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 };
        cooling = { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 };
        powerSupply = { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 };
        quantumProcessor = { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 };
        automation = { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 };
        
        // Reset altcoins
        for (const key in altcoins) {
            altcoins[key].holdings = 0;
        }
        
        showMessage(`⚡ Prestige! +${multiplier * 0.1}x multiplier!`, 'success');
        updateMiningPower();
    } else {
        showMessage('❌ Need 1,000,000+ sats to prestige!', 'error');
    }
}

function rebirth() {
    // Progressive rebirth requirements: 100k, 500k, 1M, 2M, 5M, 10M, 20M, 50M, 100M, etc.
    const rebirthRequirements = [100000, 500000, 1000000, 2000000, 5000000, 10000000, 20000000, 50000000, 100000000];
    const currentRequirement = rebirthRequirements[Math.min(rebirthLevel, rebirthRequirements.length - 1)];
    
    if (totalMined >= currentRequirement) {
        const points = Math.floor(totalMined / currentRequirement);
        rebirthLevel++;
        rebirthPoints += points;
        rebirthMultiplier += points * 0.3; // Reduced multiplier per point for balance
        
        // Reset game but keep rebirth benefits
        satoshis = 0;
        totalMined = 0;
        totalClicks = 0;
        startTime = Date.now();
        prestigeLevel = 0;
        prestigeMultiplier = 1;
        
        // Reset upgrades
        gpu = { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 };
        cooling = { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 };
        powerSupply = { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 };
        quantumProcessor = { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 };
        automation = { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 };
        
        // Reset rebirth upgrades
        miningBoost = { level: 0, cost: 1, boost: 0.1, multiplier: 1.2 };
        efficiency = { level: 0, cost: 2, boost: 0.05, multiplier: 1.3 };
        luck = { level: 0, cost: 3, boost: 0.03, multiplier: 1.4 };
        
        // Reset altcoins
        for (const key in altcoins) {
            altcoins[key].holdings = 0;
        }
        
        const nextRequirement = rebirthRequirements[Math.min(rebirthLevel, rebirthRequirements.length - 1)];
        showMessage(`🔥 Rebirth ${rebirthLevel}! +${points} points, +${(points * 0.3).toFixed(1)}x multiplier! Next: ${nextRequirement.toLocaleString()} sats`, 'success');
        updateMiningPower();
    } else {
        const nextRequirement = rebirthRequirements[Math.min(rebirthLevel, rebirthRequirements.length - 1)];
        showMessage(`❌ Need ${nextRequirement.toLocaleString()}+ sats to rebirth!`, 'error');
    }
}

// --- Settings Modal Functions ---

function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

function resetGame() {
    if (confirm('⚠️ Are you sure you want to reset the game? This will delete ALL progress including prestige levels!')) {
        // Reset all game state
        satoshis = 0;
        miningPowerPerClick = 1;
        miningPowerPerSecond = 0;
        totalMined = 0;
        totalClicks = 0;
        startTime = Date.now();
        prestigeLevel = 0;
        prestigeMultiplier = 1;
        rebirthLevel = 0;
        rebirthMultiplier = 1;
        rebirthPoints = 0;
        
        // Reset upgrades
        gpu = { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 };
        cooling = { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 };
        powerSupply = { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 };
        quantumProcessor = { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 };
        automation = { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 };
        
        // Reset rebirth upgrades
        miningBoost = { level: 0, cost: 1, boost: 0.1, multiplier: 1.2 };
        efficiency = { level: 0, cost: 2, boost: 0.05, multiplier: 1.3 };
        luck = { level: 0, cost: 3, boost: 0.03, multiplier: 1.4 };
        
        // Reset altcoins
        for (const key in altcoins) {
            altcoins[key].holdings = 0;
        }
        
        // Clear localStorage
        localStorage.removeItem('miningManiaSave');
        
        showMessage('🔄 Game reset successfully!', 'success');
        updateMiningPower();
    }
}

// --- Tab Functions ---

function switchTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.add('hidden'));
    
    // Remove active state from all tabs
    const tabs = ['rigTab', 'rebirthTab', 'marketTab'];
    tabs.forEach(tabId => {
        const tab = document.getElementById(tabId);
        tab.classList.remove('bg-purple-600', 'bg-orange-600', 'bg-teal-600', 'text-white');
        tab.classList.add('text-gray-400', 'hover:bg-gray-700');
    });
    
    // Show selected tab content and activate tab
    const contentId = tabName + 'Content';
    const tabId = tabName + 'Tab';
    
    document.getElementById(contentId).classList.remove('hidden');
    
    const activeTab = document.getElementById(tabId);
    activeTab.classList.remove('text-gray-400', 'hover:bg-gray-700');
    
    // Set appropriate color based on tab
    const colors = {
        'rig': 'bg-purple-600',
        'rebirth': 'bg-orange-600', 
        'market': 'bg-teal-600'
    };
    
    activeTab.classList.add(colors[tabName], 'text-white');
}

// --- Mining Function ---

function mine() {
    satoshis += miningPowerPerClick;
    totalMined += miningPowerPerClick;
    totalClicks++;
    
    mineButton.classList.add('mining-pulse');
    setTimeout(() => mineButton.classList.remove('mining-pulse'), 600);
    
    updateUI();
}

// --- Initialize Game ---

function initGame() {
    loadGame(); // Try to load saved game first
    updateMiningPower();
    updateUI();
    setInterval(gameLoop, 1000);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            mine();
        }
        // Close settings modal with Escape key
        if (event.code === 'Escape') {
            closeSettings();
        }
    });
    
    // Close settings modal when clicking outside
    document.getElementById('settingsModal').addEventListener('click', function(event) {
        if (event.target === this) {
            closeSettings();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame); 