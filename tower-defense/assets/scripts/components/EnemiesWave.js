cc.Class({
    extends: cc.Component,

    properties: {
        enemy: {
            default: null,
            type: cc.Prefab
        },
        enemiesCount: 0,
        timeout: 5,
        repeatInterval: 1
    }
});
