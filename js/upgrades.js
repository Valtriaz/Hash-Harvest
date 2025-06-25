import { gameState } from './state.js';
import { updateMiningPower } from './game.js';

/**
 * Generic upgrade handler.
 * @param {string} upgradeKey - The key for the upgrade in the gameState (e.g., 'gpu', 'miningBoost').
 * @param {string} currencyKey - The key for the currency to use (e.g., 'satoshis', 'rebirthPoints').
 * @param {string} successMessage - A template for the success message.
 * @param {string} failureMessage - The message to show on failure.
 * @returns {{success: boolean, message: string}}
 */
function handleUpgrade(upgradeKey, currencyKey, successMessage, failureMessage) {
    const s = gameState.getState();
    const currency = s[currencyKey];
    const upgrade = s[upgradeKey];

    if (currency >= upgrade.cost) {
        gameState.updateState({
            [currencyKey]: currency - upgrade.cost,
            [upgradeKey]: {
                ...upgrade,
                level: upgrade.level + 1,
                cost: Math.floor(upgrade.cost * upgrade.multiplier)
            }
        });
        updateMiningPower();
        // Get the new level for the message
        const newLevel = gameState.getState()[upgradeKey].level;
        return { success: true, message: successMessage.replace('{level}', newLevel) };
    }
    return { success: false, message: failureMessage };
}

// --- Rig Upgrades ---
export const buyGpu = () => handleUpgrade('gpu', 'satoshis', '🚀 GPU upgraded to Level {level}!', '❌ Not enough sats for GPU upgrade!');
export const buyCooling = () => handleUpgrade('cooling', 'satoshis', '❄️ Cooling System upgraded to Level {level}!', '❌ Not enough sats for Cooling System upgrade!');
export const buyPowerSupply = () => handleUpgrade('powerSupply', 'satoshis', '⚡ Power Supply upgraded to Level {level}!', '❌ Not enough sats for Power Supply upgrade!');
export const buyQuantum = () => handleUpgrade('quantumProcessor', 'satoshis', '🔬 Quantum Processor researched! Level {level}!', '❌ Not enough sats for Quantum Processor research!');
export const buyAutomation = () => handleUpgrade('automation', 'satoshis', '🤖 Mining Automation researched! Level {level}!', '❌ Not enough sats for Mining Automation research!');

// --- Rebirth Upgrades ---
export const buyMiningBoost = () => handleUpgrade('miningBoost', 'rebirthPoints', '🚀 Mining Boost upgraded to Level {level}!', '❌ Not enough Rebirth Points for Mining Boost upgrade!');
export const buyEfficiency = () => handleUpgrade('efficiency', 'rebirthPoints', '⚡ Efficiency upgraded to Level {level}!', '❌ Not enough Rebirth Points for Efficiency upgrade!');
export const buyLuck = () => handleUpgrade('luck', 'rebirthPoints', '🍀 Luck upgraded to Level {level}!', '❌ Not enough Rebirth Points for Luck upgrade!');