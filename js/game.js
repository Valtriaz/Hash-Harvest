import { gameState } from './state.js';

// All game state, including initial values, is managed by the central `gameState` object from './state.js'.
// This file contains the core game logic functions that operate on that state.

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
