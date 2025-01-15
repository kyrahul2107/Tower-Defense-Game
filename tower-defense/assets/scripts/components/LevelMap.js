cc.Class({
    extends: cc.Component,

    properties: {
    },

    init () {
        // get TiledMap component
        this.tiledMap = this.getComponent(cc.TiledMap);
        cc.log(this.tiledMap);

        // get layers
        this.roadsLayer = this.tiledMap.getLayer('roads');
        this.towersLayer = this.tiledMap.getLayer('towers');

        cc.log(this.roadsLayer);
        cc.log(this.towersLayer);

        this.tileSize = this.tiledMap.getTileSize();
        this.tileWidth = this.tileSize.width;
        this.tileHeight = this.tileSize.height;
        cc.log(this.tileSize, this.tileWidth, this.tileHeight);

        this.mapSize = this.tiledMap.getMapSize();
        this.mapWidth = this.mapSize.width;
        this.mapHeight = this.mapSize.height;
        cc.log(this.mapSize, this.mapWidth, this.mapHeight);

        const coords = this.getTileCoordinatesByPosition(cc.v2(200, 200));
        cc.log(coords);
    },

    getTileCoordinatesByPosition(position) {
        return {
            x: Math.floor(position.x / this.tileWidth),
            y: this.mapHeight - Math.floor(position.y / this.tileHeight) - 1
        };
    },
});
