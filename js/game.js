import { gameState } from './state.js';

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

// Rebirth requirements progression (global)
const REBIRTH_REQUIREMENTS = [
    10_000, 25_000, 50_000, 100_000, 250_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000, 50_000_000, 100_000_000
];

export function getRebirthRequirement(level) {
    if (level < REBIRTH_REQUIREMENTS.length) {
        return REBIRTH_REQUIREMENTS[level];
    } else {
        return REBIRTH_REQUIREMENTS[REBIRTH_REQUIREMENTS.length - 1] * Math.pow(2, level - REBIRTH_REQUIREMENTS.length + 1);
    }
}

export function updateMiningPower() {
    const s = gameState.getState();
    let perClick = s.gpu.level * s.gpu.baseClick;
    let perSecond = s.gpu.level * s.gpu.baseIdle;
    perClick *= (1 + s.cooling.level * s.cooling.efficiencyBoost);
    perSecond *= (1 + s.cooling.level * s.cooling.efficiencyBoost);
    perClick *= (1 + s.quantumProcessor.level * s.quantumProcessor.megaBoost);
    perSecond *= (1 + s.quantumProcessor.level * s.quantumProcessor.megaBoost);
    perSecond += s.automation.level * s.automation.autoClickRate * perClick;
    perClick *= s.prestigeMultiplier;
    perSecond *= s.prestigeMultiplier;
    perClick *= s.rebirthMultiplier;
    perSecond *= s.rebirthMultiplier;
    perClick *= (1 + s.miningBoost.level * s.miningBoost.boost);
    perSecond *= (1 + s.miningBoost.level * s.miningBoost.boost);
    perClick = Math.round(perClick * 100) / 100;
    perSecond = Math.round(perSecond * 100) / 100;
    gameState.updateState({ miningPowerPerClick: perClick, miningPowerPerSecond: perSecond });
}

export function mine() {
    const s = gameState.getState();
    const mined = s.miningPowerPerClick;
    gameState.updateState({
        satoshis: s.satoshis + mined,
        totalMined: s.totalMined + mined,
        totalClicks: s.totalClicks + 1
    });
}

export function gameLoop() {
    const s = gameState.getState();
    const mined = s.miningPowerPerSecond;
    gameState.updateState({
        satoshis: s.satoshis + mined,
        totalMined: s.totalMined + mined
    });
    fluctuatePrices();
}

export function fluctuatePrices() {
    const s = gameState.getState();
    const newAltcoins = { ...s.altcoins };
    for (const key in newAltcoins) {
        const coin = { ...newAltcoins[key] };
        const change = coin.price * (Math.random() * 2 * coin.volatility - coin.volatility);
        coin.price = Math.max(0.01, coin.price + change);
        newAltcoins[key] = coin;
    }
    gameState.updateState({ altcoins: newAltcoins });
}

export function buyAltcoin(coinName) {
    const s = gameState.getState();
    const coin = s.altcoins[coinName];
    if (!coin) return { success: false, message: `❌ Unknown altcoin: ${coinName}` };
    if (s.satoshis >= coin.price) {
        const newAltcoins = { ...s.altcoins };
        newAltcoins[coinName] = { ...coin, holdings: coin.holdings + 1 };
        gameState.updateState({
            satoshis: s.satoshis - coin.price,
            altcoins: newAltcoins
        });
        return { success: true, message: `📈 Bought 1 ${coinName}!` };
    } else {
        return { success: false, message: `❌ Not enough sats to buy 1 ${coinName}!` };
    }
}

export function sellAltcoin(coinName) {
    const s = gameState.getState();
    const coin = s.altcoins[coinName];
    if (!coin) return { success: false, message: `❌ Unknown altcoin: ${coinName}` };
    if (coin.holdings > 0) {
        const newAltcoins = { ...s.altcoins };
        newAltcoins[coinName] = { ...coin, holdings: coin.holdings - 1 };
        gameState.updateState({
            satoshis: s.satoshis + coin.price,
            altcoins: newAltcoins
        });
        return { success: true, message: `📉 Sold 1 ${coinName}!` };
    } else {
        return { success: false, message: `❌ No ${coinName} to sell!` };
    }
}

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