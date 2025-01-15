const LevelMap = require('LevelMap');
const PanelCreate = require('PanelCreate');
const PanelUpgrade = require('PanelUpgrade');
const Towers = require('Towers');
const Enemies = require('Enemies');
const UI = require('UI');

cc.Class({
    extends: cc.Component,

    properties: {
        panelCreate: {
            default: null,
            type: PanelCreate
        },
        panelUpgrade: {
            default: null,
            type: PanelUpgrade
        },
        map: {
            default: null,
            type: LevelMap
        },
        towers: {
            default: null,
            type: Towers
        },
        enemies: {
            default: null,
            type: Enemies
        },
        ui: {
            default: null,
            type: UI
        },
    },

    onLoad () {
        this.init();
        this.setEvents();
    },

    init() {
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;

        this.player = {
            lives: 20,
            coins: 200
        };

        this.map.init();
        this.towers.init(this.map);
        this.enemies.init(this);
        this.ui.init(this);
        this.panelCreate.init(this);
        this.panelUpgrade.init(this);
    },

    setEvents() {
        this.map.node.on(cc.Node.EventType.TOUCH_END, this.onMapTouch, this);
        this.panelCreate.node.on('button-click', this.onTowerCreate, this);

        this.panelUpgrade.button1.on(cc.Node.EventType.TOUCH_END, this.onTowerUpgrade, this);
        this.panelUpgrade.button2.on(cc.Node.EventType.TOUCH_END, this.onTowerDestroy, this);

        this.enemies.node.on('enemy-killed', this.onEnemyKilled, this);
        this.enemies.node.on('enemy-finished', this.onEnemyFinished, this);

        this.enemies.node.on("timer-tick", this.render, this);
        this.enemies.node.on("wave-complete", this.render, this);
    },

    onTowerUpgrade() {
        if (this.player.coins >= this.panelUpgrade.tower.upgradePrice && 
            this.panelUpgrade.tower.level < this.panelUpgrade.tower.maxLevel
            ) {
                this.player.coins -= this.panelUpgrade.tower.upgradePrice;
                this.panelUpgrade.tower.upgrade();
                this.panelUpgrade.hide();
                this.render();
            }

    },

    onTowerDestroy() {
        this.player.coins += this.panelUpgrade.tower.destructionReward;
        this.towers.remove(this.panelUpgrade.tower);
        this.panelUpgrade.hide();
        this.render();
    },


    render() {
        this.ui.render();
    },

    onEnemyFinished() {
        this.player.lives--;
        this.render();
    },

    onEnemyKilled() {
        this.player.coins += 50;
        this.render();
    },

    onTowerCreate(data) {
        const price = this.towers.prices[data.towerKey];

        if (price && this.player.coins >= price) {
            this.player.coins -= price;
            this.towers.create(data.towerKey, data.towerCoordinates);
            this.panelCreate.hide();
            this.ui.render();
        }
    },

    onMapTouch(e) {
        this.panelCreate.hide();
        const location = e.getLocation();
        const position = {
            x: location.x * 2,
            y: location.y * 2
        };
        const coordinates = this.map.getTileCoordinatesByPosition(position);
        const tileId = this.map.towersLayer.getTileGIDAt(coordinates);

        if (tileId) {
            const tower = this.towers.getByCoordinates(coordinates);

            if (!tower) {
                this.panelCreate.show(coordinates);
            } else {
                this.panelUpgrade.show(coordinates, tower);
            }
        }
    }
});
