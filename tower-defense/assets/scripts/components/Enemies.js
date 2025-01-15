const EnemiesWave = require('EnemiesWave');

cc.Class({
    extends: cc.Component,

    properties: {
        waves: {
            default: [],
            type: [EnemiesWave]
        }
    },

    init (level) {
        this.waveIndex = 0;
        this.wavesCount = this.waves.length;
        this.level = level;
        this.items = [];
        this.createWave();
    },

    // Creating wave of Enemies 
    createWave() {
        const wave = this.waves[this.waveIndex];
        if (!wave) {
            return;
        }
        ++this.waveIndex;

        this.schedule(() => {
            this.createEnemy(wave.enemy)
        }, wave.repeatInterval, wave.enemiesCount - 1, wave.timeout);

        this.waveTimeout = wave.timeout;

        this.schedule(() => {
            --this.waveTimeout;
            this.node.emit("timer-tick");
        }, 1, wave.timeout);
    },

    createEnemy(enemyPrefab) {
        const enemyNode = cc.instantiate(enemyPrefab);
        this.node.addChild(enemyNode);
        const enemyComponent = enemyNode.getComponent('Enemy');
        enemyComponent.init(this.level);
        this.items.push(enemyComponent);

        enemyNode.once('killed', () => {
            this.onEnemyRemoved("enemy-killed", enemyComponent);
        }, this);

        enemyNode.once('finished', () => {
            this.onEnemyRemoved("enemy-finished", enemyComponent);
        }, this);
    },

    onEnemyRemoved(eventName, enemyComponent) {
        this.node.emit(eventName, enemyComponent);
        this.items = this.items.filter(item => item !== enemyComponent);

        if (!this.items.length) {
            this.node.emit("wave-complete");
            this.createWave();
        } 
    }


});
