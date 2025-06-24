// Save/Load Functions

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
    const currentRequirement = window.getRebirthRequirement(rebirthLevel);
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
        const nextRequirement = window.getRebirthRequirement(rebirthLevel);
        showMessage(`🔥 Rebirth ${rebirthLevel}! +${points} points, +${(points * 0.3).toFixed(1)}x multiplier! Next: ${nextRequirement.toLocaleString()} sats`, 'success');
        updateMiningPower();
        updateProgressDisplays();
    } else {
        const nextRequirement = window.getRebirthRequirement(rebirthLevel);
        showMessage(`❌ Need ${nextRequirement.toLocaleString()}+ sats to rebirth!`, 'error');
    }
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

// Settings Modal Functions

function openSettings() {
    document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
} 