const PricesConfig = {
    tower1: 50,
    tower2: 60
};

cc.Class({
    extends: cc.Component,

    properties: {
        towersPrefabs: {
            default: [],
            type: [cc.Prefab]
        }
    },

    init(map) {
        this.map = map;
        this.items = [];
        this.prices = PricesConfig;
    },

    remove(tower) {
        tower.node.destroy(true);
        this.items = this.items.filter(item => item !== tower);
    },

    getByCoordinates(coordinates) {
        return this.items.find(towerComponent =>
                towerComponent.coordinates.x === coordinates.x &&
                towerComponent.coordinates.y === coordinates.y);
    },

    create(key, coordinates) {
        // find a prefab
        const towerPrefab = this.towersPrefabs.find(towerPrefab => towerPrefab.name === key);

        // create the correct node
        const towerNode = cc.instantiate(towerPrefab);
        this.node.addChild(towerNode);

        // initialize the tower component
        const towerComponent = towerNode.getComponent('Tower');
        towerComponent.init(coordinates);

        // store the created tower component in this.items
        this.items.push(towerComponent);

        // place the created node in the correct position based on the coordinates
        const position = this.map.towersLayer.getPositionAt(coordinates);
        cc.log(position);
        towerNode.setPosition(
            cc.v2(
                position.x + this.map.tileWidth / 2,
                position.y + this.map.tileHeight / 2
            )
        );
    }
});
