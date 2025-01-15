const LevelMap = require('LevelMap');


cc.Class({
    extends: cc.Component,

    properties: {
        lives: 3,
        velocity: 150,
        rotationSpeed: 300
    },

    init(level) {
        this.levelMap = level.map;
    },

    start () {
        this.targets = this.levelMap.tiledMap.getObjectGroup('path').getObjects();
        this.targetIndex = 1;

        this.node.setPosition(this.getCurrentTargetPosition());


        this.targetIndex++;
        this.move();
    },

    move() {
        const targetPostion = this.getCurrentTargetPosition();

        if (!targetPostion) {
            this.node.emit('finished');
            this.node.destroy();
        } else {
            this.rotateTo(targetPostion);
            this.moveTo(targetPostion).then(() => {
                this.targetIndex++;
                this.move();
            });
        }
    },

    takeDamage(damage) {
        this.lives -= damage;

        if (this.lives <= 0) {
            this.node.stopAllActions();
            this.node.emit("killed");
            this.node.destroy();
        }
    },

    getAngle(targetPostion) {
        return Math.atan2(targetPostion.y - this.node.y, targetPostion.x - this.node.x) * 180 / Math.PI;
    },

    rotateTo(targetPostion) {
        // 1. Calculate the angle to a given target relative to the current node position
        const angle = this.getAngle(targetPostion);

        // 2. Rotate the sprite by the obtained angle
        // this.node.angle = angle;

        const distance = Math.abs(angle - this.node.angle);

        if (distance) {
            const time = distance / this.rotationSpeed;
            this.node.runAction(cc.rotateTo(time, angle));
        }
    },

    moveTo(targetPostion) {
        const x = Math.abs(targetPostion.x - this.node.x);
        const y = Math.abs(targetPostion.y - this.node.y);
        const distance = Math.max(x, y);
        const time = distance / this.velocity;

        return new Promise(resolve => {
            const moveToAction = cc.moveTo(time, targetPostion);
            const sequence = cc.sequence(
                moveToAction,
                cc.callFunc(resolve)
            );
            this.node.runAction(sequence);
        });
    },

    getCurrentTarget() {
        return this.targets.find(target => parseInt(target.name) === this.targetIndex);
    },

    getCurrentTargetPosition() {
        // get the path object from the path layer
        const currentTarget = this.getCurrentTarget();

        if (!currentTarget) {
            return false;
        }

        // get the row and a column of the tile containig the path object
        const tileCoordinates = this.levelMap.getTileCoordinatesByPosition(cc.v2(currentTarget.x, currentTarget.y));

        // get the coordinates in pixels of that tile
        const position = this.levelMap.roadsLayer.getPositionAt(tileCoordinates.x, tileCoordinates.y);

        // get the center of that tile
        return cc.v2(position.x + this.levelMap.tileWidth / 2, position.y + this.levelMap.tileHeight / 2);
    }
});
