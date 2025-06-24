import { gameState } from './state.js';
import { updateMiningPower } from './game.js';

/**
 * Upgrade GPU
 */
export function buyGpu() {
    const s = gameState.getState();
    const { satoshis, gpu } = s;
    if (satoshis >= gpu.cost) {
        gameState.updateState({
            satoshis: satoshis - gpu.cost,
            gpu: {
                ...gpu,
                level: gpu.level + 1,
                cost: Math.floor(gpu.cost * gpu.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `🚀 GPU upgraded to Level ${gpu.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough sats for GPU upgrade!' };
}

/**
 * Upgrade Cooling System.
 */
export function buyCooling() {
    const s = gameState.getState();
    const { satoshis, cooling } = s;
    if (satoshis >= cooling.cost) {
        gameState.updateState({
            satoshis: satoshis - cooling.cost,
            cooling: {
                ...cooling,
                level: cooling.level + 1,
                cost: Math.floor(cooling.cost * cooling.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `❄️ Cooling System upgraded to Level ${cooling.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough sats for Cooling System upgrade!' };
}

/**
 * Upgrade Power Supply.
 */
export function buyPowerSupply() {
    const s = gameState.getState();
    const { satoshis, powerSupply } = s;
    if (satoshis >= powerSupply.cost) {
        gameState.updateState({
            satoshis: satoshis - powerSupply.cost,
            powerSupply: {
                ...powerSupply,
                level: powerSupply.level + 1,
                cost: Math.floor(powerSupply.cost * powerSupply.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `⚡ Power Supply upgraded to Level ${powerSupply.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough sats for Power Supply upgrade!' };
}

/**
 * Upgrade Quantum Processor.
 */
export function buyQuantum() {
    const s = gameState.getState();
    const { satoshis, quantumProcessor } = s;
    if (satoshis >= quantumProcessor.cost) {
        gameState.updateState({
            satoshis: satoshis - quantumProcessor.cost,
            quantumProcessor: {
                ...quantumProcessor,
                level: quantumProcessor.level + 1,
                cost: Math.floor(quantumProcessor.cost * quantumProcessor.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `🔬 Quantum Processor researched! Level ${quantumProcessor.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough sats for Quantum Processor research!' };
}

/**
 * Upgrade Mining Automation.
 */
export function buyAutomation() {
    const s = gameState.getState();
    const { satoshis, automation } = s;
    if (satoshis >= automation.cost) {
        gameState.updateState({
            satoshis: satoshis - automation.cost,
            automation: {
                ...automation,
                level: automation.level + 1,
                cost: Math.floor(automation.cost * automation.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `🤖 Mining Automation researched! Level ${automation.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough sats for Mining Automation research!' };
}

// --- Rebirth Upgrades ---

/**
 * Upgrade Mining Boost (Rebirth)
 */
export function buyMiningBoost() {
    const s = gameState.getState();
    const { rebirthPoints, miningBoost } = s;
    if (rebirthPoints >= miningBoost.cost) {
        gameState.updateState({
            rebirthPoints: rebirthPoints - miningBoost.cost,
            miningBoost: {
                ...miningBoost,
                level: miningBoost.level + 1,
                cost: Math.floor(miningBoost.cost * miningBoost.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `🚀 Mining Boost upgraded to Level ${miningBoost.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough Rebirth Points for Mining Boost upgrade!' };
}

/**
 * Upgrade Efficiency (Rebirth).
 */
export function buyEfficiency() {
    const s = gameState.getState();
    const { rebirthPoints, efficiency } = s;
    if (rebirthPoints >= efficiency.cost) {
        gameState.updateState({
            rebirthPoints: rebirthPoints - efficiency.cost,
            efficiency: {
                ...efficiency,
                level: efficiency.level + 1,
                cost: Math.floor(efficiency.cost * efficiency.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `⚡ Efficiency upgraded to Level ${efficiency.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough Rebirth Points for Efficiency upgrade!' };
}

/**
 * Upgrade Luck (Rebirth).
 */
export function buyLuck() {
    const s = gameState.getState();
    const { rebirthPoints, luck } = s;
    if (rebirthPoints >= luck.cost) {
        gameState.updateState({
            rebirthPoints: rebirthPoints - luck.cost,
            luck: {
                ...luck,
                level: luck.level + 1,
                cost: Math.floor(luck.cost * luck.multiplier)
            }
        });
        updateMiningPower();
        return { success: true, message: `🍀 Luck upgraded to Level ${luck.level + 1}!` };
    }
    return { success: false, message: '❌ Not enough Rebirth Points for Luck upgrade!' };
} 