// Upgrade Functions

function buyGpu() {
    if (satoshis >= gpu.cost) {
        satoshis -= gpu.cost;
        gpu.level++;
        gpu.cost = Math.floor(gpu.cost * gpu.multiplier);
        showMessage(`🚀 GPU upgraded to Level ${gpu.level}!`, 'success');
        
        const buyGpuButton = document.getElementById('buyGpuButton');
        if (buyGpuButton && buyGpuButton.parentElement) {
            buyGpuButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyGpuButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
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
        
        const buyCoolingButton = document.getElementById('buyCoolingButton');
        if (buyCoolingButton && buyCoolingButton.parentElement) {
            buyCoolingButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyCoolingButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
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
        
        const buyPowerSupplyButton = document.getElementById('buyPowerSupplyButton');
        if (buyPowerSupplyButton && buyPowerSupplyButton.parentElement) {
            buyPowerSupplyButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyPowerSupplyButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
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
        
        const buyQuantumButton = document.getElementById('buyQuantumButton');
        if (buyQuantumButton && buyQuantumButton.parentElement) {
            buyQuantumButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyQuantumButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
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
        
        const buyAutomationButton = document.getElementById('buyAutomationButton');
        if (buyAutomationButton && buyAutomationButton.parentElement) {
            buyAutomationButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyAutomationButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
        updateMiningPower();
    } else {
        showMessage('❌ Not enough sats for Mining Automation research!', 'error');
    }
}

// Rebirth Upgrade Functions

function buyMiningBoost() {
    if (rebirthPoints >= miningBoost.cost) {
        rebirthPoints -= miningBoost.cost;
        miningBoost.level++;
        miningBoost.cost = Math.floor(miningBoost.cost * miningBoost.multiplier);
        showMessage(`🚀 Mining Boost upgraded to Level ${miningBoost.level}!`, 'success');
        
        const buyMiningBoostButton = document.getElementById('buyMiningBoostButton');
        if (buyMiningBoostButton && buyMiningBoostButton.parentElement) {
            buyMiningBoostButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyMiningBoostButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
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
        
        const buyEfficiencyButton = document.getElementById('buyEfficiencyButton');
        if (buyEfficiencyButton && buyEfficiencyButton.parentElement) {
            buyEfficiencyButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyEfficiencyButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
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
        
        const buyLuckButton = document.getElementById('buyLuckButton');
        if (buyLuckButton && buyLuckButton.parentElement) {
            buyLuckButton.parentElement.classList.add('upgrade-glow');
            setTimeout(() => buyLuckButton.parentElement.classList.remove('upgrade-glow'), 800);
        }
        
        updateMiningPower();
    } else {
        showMessage('❌ Not enough Rebirth Points for Luck upgrade!', 'error');
    }
}

// Altcoin Market Functions

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