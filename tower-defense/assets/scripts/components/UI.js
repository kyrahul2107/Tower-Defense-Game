
cc.Class({
    extends: cc.Component,

    properties: {
        coinsAmount: {
            default: null,
            type: cc.Label
        },
        livesAmount: {
            default: null,
            type: cc.Label
        },
        waveAmount: {
            default: null,
            type: cc.Label
        },
        waveTimeout: {
            default: null,
            type: cc.Label
        },
    },

    init (level) {
        this.level = level;
        this.render();
    },
    render() {
        this.livesAmount.string = this.level.player.lives.toString();
        this.coinsAmount.string = this.level.player.coins.toString();

        this.waveAmount.string = this.level.enemies.waveIndex.toString() + '/' + this.level.enemies.wavesCount.toString(); 

        if (this.level.enemies.waveTimeout > 0) {
            this.waveTimeout.node.active = true;
            this.waveTimeout.string = '(' + this.level.enemies.waveTimeout.toString() + ')';
        } else {
            this.waveTimeout.node.active = false;
        }
    }

});
