cc.Class({
    extends: cc.Component,

    properties: {
        button1: {
            default: null,
            type: cc.Node
        },
        button2: {
            default: null,
            type: cc.Node
        },
    },

    init(level) {
        this.level = level;
        this.map = this.level.map;
        this.coordinates = {x: 0, y: 0};

        this.button1.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);
        this.button2.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this);

        this.button1.getChildByName("price").getComponent(cc.Label).string = this.level.towers.prices.tower1.toString();
        this.button2.getChildByName("price").getComponent(cc.Label).string = this.level.towers.prices.tower2.toString();
    },

    show(coordinates) {
        this.coordinates = coordinates;
        const position = this.map.towersLayer.getPositionAt(this.coordinates);
        this.node.setPosition(cc.v2(position.x + this.map.tileWidth / 2, position.y + this.map.tileWidth / 2));
        this.node.active = true;
        console.log(this.node, this.node.position, this.node.active);
    },

    hide() {
        this.node.active = false;
    },

    onButtonClick(event) {
        this.node.emit('button-click', {
            towerKey: event.target.name,
            towerCoordinates: this.coordinates
        });
    }




});
