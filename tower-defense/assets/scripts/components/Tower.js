cc.Class({
    extends: cc.Component,

    properties: {
        fire: {
            default: null,
            type: cc.Prefab
        },
        rotationSpeed: 500,
        reloadTime: 0.5,

        destructionReward: 40,
        upgradePrice: 15,
        level: 1,
        maxLevel: 5
    },

    init(coordinates) {
        this.coordinates = coordinates;
        this.targets = [];
        this.collider = this.getComponent(cc.CircleCollider);

        this.schedule(() => {
            this.tryFire();
        }, this.reloadTime);
    },

    tryFire() {
        const targetNode = this.getTarget();

        if (targetNode &&  targetNode.active) {
            const targetPosition = cc.v2(targetNode.x, targetNode.y);
            this.rotateTo(targetPosition).then(() => {
                this.createFire(targetPosition);
            });
        }
    },

    createFire(targetPosition) {
        const fireNode = cc.instantiate(this.fire);
        fireNode.position = cc.v2(this.node.x, this.node.y);
        fireNode.angle = this.node.angle;
        this.node.parent.addChild(fireNode);
        fireNode.getComponent('Fire').init(targetPosition);
    },

    getAngle(targetPostion) {
        return Math.atan2(targetPostion.y - this.node.y, targetPostion.x - this.node.x) * 180 / Math.PI - 90;
    },

    rotateTo(targetPostion) {
        const angle = this.getAngle(targetPostion);

        const distance = Math.abs(angle - this.node.angle);

        return new Promise(resolve => {
            if (distance) {
                const time = distance / this.rotationSpeed;
                this.node.runAction(cc.sequence(
                    cc.rotateTo(time, angle),
                    cc.callFunc(resolve)
                ));
            } else {
                resolve();
            }
        });
    },

    onCollisionEnter(other, self) {
        if (other.node.name === 'enemy') {
            this.targets.push(other.node);
        }
        cc.log('onCollisionEnter', this.targets);
    },
    onCollisionExit(other, self) {
        this.removeTarget(other.node);
        cc.log('onCollisionExit', this.targets);
    },
    removeTarget(node) {
        this.targets = this.targets.filter(target => target !== node);
    },

    getTarget() {
        return this.targets.length ? this.targets.find(target => target.active) : false;
    },

    upgrade() {
        ++this.level;

        this.collider.radius += 0.1 * this.collider.radius;
        this.rotationSpeed += 0.1 * this.rotationSpeed;
        this.reloadTime -= 0.1 * this.reloadTime;

        cc.log(this.collider.radius, this.rotationSpeed, this.reloadTime);

        this.unscheduleAllCallbacks();
        this.schedule(() => {
            this.tryFire();
        }, this.reloadTime);
    }
});
