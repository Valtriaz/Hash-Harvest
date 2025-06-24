// Centralized and robust game state management module.
// This pattern encapsulates the state, preventing direct mutation
// and ensuring a predictable, unidirectional data flow.

// Refactored state management using ES6+ class-based singleton pattern

class GameState {
    #state;
    #listeners;

    constructor() {
        this.#state = this.#getInitialState();
        this.#listeners = new Set();
    }

    #getInitialState() {
        return {
            satoshis: 0,
            miningPowerPerClick: 1,
            miningPowerPerSecond: 0,
            totalMined: 0,
            totalClicks: 0,
            startTime: Date.now(),
            prestigeLevel: 0,
            prestigeMultiplier: 1,
            rebirthLevel: 0,
            rebirthMultiplier: 1,
            rebirthPoints: 0,
            gpu: { level: 1, cost: 10, baseClick: 1, baseIdle: 0.1, multiplier: 1.2 },
            cooling: { level: 0, cost: 50, efficiencyBoost: 0.05, multiplier: 1.3 },
            powerSupply: { level: 0, cost: 200, capacityIncrease: 1, multiplier: 1.4 },
            quantumProcessor: { level: 0, cost: 1000000, megaBoost: 100, multiplier: 2.0 },
            automation: { level: 0, cost: 5000, autoClickRate: 1, multiplier: 1.5 },
            miningBoost: { level: 0, cost: 1, boost: 0.1, multiplier: 1.2 },
            efficiency: { level: 0, cost: 2, boost: 0.05, multiplier: 1.3 },
            luck: { level: 0, cost: 3, boost: 0.03, multiplier: 1.4 },
            altcoins: {
                'Bitcoin': { price: 500, holdings: 0, volatility: 0.05, color: 'orange' },
                'Ethereum': { price: 150, holdings: 0, volatility: 0.08, color: 'blue' },
                'Litecoin': { price: 25, holdings: 0, volatility: 0.12, color: 'gray' },
                'Dogecoin': { price: 0.8, holdings: 0, volatility: 0.25, color: 'yellow' },
                'Cardano': { price: 35, holdings: 0, volatility: 0.15, color: 'green' },
                'Solana': { price: 80, holdings: 0, volatility: 0.18, color: 'purple' }
            }
        };
    }

    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener);
    }

    getState() {
        // Return a deep clone for safety
        return JSON.parse(JSON.stringify(this.#state));
    }

    updateState(partialState) {
        this.#deepMerge(this.#state, partialState);
        this.#notify();
    }

    loadState(newState) {
        this.#state = newState;
        this.#notify();
    }

    resetState() {
        this.#state = this.#getInitialState();
        this.#notify();
    }

    #notify() {
        const readOnlyState = this.#makeReadOnly(this.#state);
        this.#listeners.forEach(listener => listener(readOnlyState));
    }

    #makeReadOnly(obj) {
        // Recursively make the object read-only
        return new Proxy(obj, {
            get(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (value && typeof value === 'object' && value !== null) {
                    return new Proxy(value, this);
                }
                return value;
            },
            set() {
                console.warn('Attempted to mutate state directly. Use updateState().');
                return true;
            }
        });
    }

    #deepMerge(target, source) {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
                this.#deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }
}

// Export a singleton instance
export const gameState = new GameState();