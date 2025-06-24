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

// --- Mining Function ---
function mine() {
    satoshis += miningPowerPerClick;
    totalMined += miningPowerPerClick;
    totalClicks++;
    
    const mineButton = document.getElementById('mineButton');
    if (mineButton) {
        // Remove shimmer and pulse to reset
        mineButton.classList.remove('shimmer', 'mining-pulse');
        // Force reflow to restart animation
        void mineButton.offsetWidth;
        // Add mining pulse
        mineButton.classList.add('mining-pulse');
        // After animation, restore shimmer
        setTimeout(() => {
            mineButton.classList.remove('mining-pulse');
            mineButton.classList.add('shimmer');
        }, 500);
    }
    
    updateUI();
}

// --- Game Loop ---
function gameLoop() {
    satoshis += miningPowerPerSecond;
    totalMined += miningPowerPerSecond;
    fluctuatePrices();
    updateUI();
}

// --- Altcoin Market Functions ---
function fluctuatePrices() {
    for (const key in altcoins) {
        const coin = altcoins[key];
        const change = coin.price * (Math.random() * 2 * coin.volatility - coin.volatility);
        coin.price = Math.max(0.01, coin.price + change);
    }
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