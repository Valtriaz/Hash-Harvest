// Main entry point for Mining Mania
// Handles initialization and event listeners

// Initialize game when DOM is loaded
window.onload = function() {
    // Load saved game first
    loadGame();
    
    // Initialize game state
    updateMiningPower();
    updateUI();
    
    // Start game loop
    setInterval(gameLoop, 1000);
    
    // Set up event listeners
    setupEventListeners();
};

// Set up all event listeners
function setupEventListeners() {
    // Mining button
    const mineButton = document.getElementById('mineButton');
    if (mineButton) {
        mineButton.addEventListener('click', mine);
    }
    
    // Rebirth Now button animation
    const rebirthNowButton = document.getElementById('rebirthNowButton');
    if (rebirthNowButton) {
        rebirthNowButton.addEventListener('click', function() {
            rebirthNowButton.classList.remove('shimmer', 'mining-pulse-orange');
            void rebirthNowButton.offsetWidth;
            rebirthNowButton.classList.add('mining-pulse-orange');
            setTimeout(() => {
                rebirthNowButton.classList.remove('mining-pulse-orange');
                rebirthNowButton.classList.add('shimmer');
            }, 800);
        });
    }
    
    // Keyboard shortcuts
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
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.addEventListener('click', function(event) {
            if (event.target === this) {
                closeSettings();
            }
        });
    }
    
    // Upgrade button listeners
    setupUpgradeListeners();
}

// Set up upgrade button event listeners
function setupUpgradeListeners() {
    // Rig upgrades
    const buyGpuButton = document.getElementById('buyGpuButton');
    if (buyGpuButton) buyGpuButton.addEventListener('click', buyGpu);
    
    const buyCoolingButton = document.getElementById('buyCoolingButton');
    if (buyCoolingButton) buyCoolingButton.addEventListener('click', buyCooling);
    
    const buyPowerSupplyButton = document.getElementById('buyPowerSupplyButton');
    if (buyPowerSupplyButton) buyPowerSupplyButton.addEventListener('click', buyPowerSupply);
    
    const buyQuantumButton = document.getElementById('buyQuantumButton');
    if (buyQuantumButton) buyQuantumButton.addEventListener('click', buyQuantum);
    
    const buyAutomationButton = document.getElementById('buyAutomationButton');
    if (buyAutomationButton) buyAutomationButton.addEventListener('click', buyAutomation);
    
    // Rebirth upgrades
    const buyMiningBoostButton = document.getElementById('buyMiningBoostButton');
    if (buyMiningBoostButton) buyMiningBoostButton.addEventListener('click', buyMiningBoost);
    
    const buyEfficiencyButton = document.getElementById('buyEfficiencyButton');
    if (buyEfficiencyButton) buyEfficiencyButton.addEventListener('click', buyEfficiency);
    
    const buyLuckButton = document.getElementById('buyLuckButton');
    if (buyLuckButton) buyLuckButton.addEventListener('click', buyLuck);
} 