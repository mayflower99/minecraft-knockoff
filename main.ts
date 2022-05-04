let steve: Sprite;
class Inventory {
    heldItem: number = 3
    inventoryArray: Array<number> = [3, 2, 3, 3, 2, 3, 3, 1, 1]
    inventoryQuantitys: Array<number> = [10, 34, 64, 23, 38, 54, 63, 38, 54]
    invImg: Array<Image> = [assets.image`emptyInventory`, assets.image`obsidianImage`, assets.image`endstoneImage`, assets.image`swordImage`, assets.image`pickaxeImage`]
    inventorySprite: Sprite = sprites.create(assets.image`inventoryImage`, SpriteKind.Player)
    constructor() {
        this.render()
    }

    render() {
        // iterates through every inventory slot and adds the apropriate picture from invImg
        for (let i: number = 0; i < this.inventoryArray.length; i++) {
            //shortens inventoryArray name and gets the value at i
            let num: number = this.inventoryArray[i]
            for (let b: number = 0; b < 16; b++) {
                for (let a: number = 0; a < 16; a++) {
                    let px: number = this.invImg[num].getPixel(a, b)
                    if (i == this.heldItem) {
                        if (px == 0) {
                            px = 5
                        }
                    } else {
                        if (px == 0) {
                            px = 9
                        }
                    }
                    this.inventorySprite.image.setPixel(a + (i * 17), b + 2, px)
                }
            }
        }
    }
}
function createSteve() {
    steve = sprites.create(assets.image`steveImage`, SpriteKind.Player)
    steve.ay = 500
    scene.cameraFollowSprite(steve)
}

function mapRender(collums: number, rows: number) {
    for (let j = 0; j <= rows - 1; j++) {
        for (let b = 0; b <= collums - 1; b++) {
            if (map[j][b] == 1) {
                tiles.setTileAt(tiles.getTileLocation(b, j), assets.tile`endstoneTile`)
                tiles.setWallAt(tiles.getTileLocation(b, j), true)
            } else if (map[j][b] == 3) {
                tiles.setTileAt(tiles.getTileLocation(b, j), assets.tile`obsidianTile`)
            } else if (map[j][b] == 2) {
                tiles.setTileAt(tiles.getTileLocation(b, j), assets.tile`bedrockTile`)
            }
        }
    }
    tiles.setCurrentTilemap(endTilemap)
}

function generateMap(rows: number, collums: number) {
    for (let i = 0; i <= rows - 1; i++) {
        map.push([])
        console.log(i)
        for (let a = 0; a <= collums - 1; a++) {
            if (lilMap.getPixel(a, i) == 3) {
                map[i].push(3)
            } else if (lilMap.getPixel(a, i) == 1) {
                map[i].push(1)
            } else if (lilMap.getPixel(a, i) == 2) {
                map[i].push(2)
            } else {
                map[i].push(0)
            }
        }
    }
    // 3 =obby
    //
    // 1 = endstone
    //
    // 2 = bedrock
    //
    // 0 = blank
    mapRender(collums, rows)
}
class EnderDragon {
    sprite: Sprite = sprites.create(assets.image`enderDragonImage`, SpriteKind.Enemy)
    health: StatusBarSprite = statusbars.create(125, 4, 1)
    constructor() {
        this.createBossBar()
        this.flyRight(100)
        this.flyDown(randint(1, 20))
    }

    flyRight(velocity: number) {
        animation.runImageAnimation(this.sprite, assets.animation`dragonTurnRight`, 35, false)
        this.sprite.vx = Math.abs(velocity)
        animation.runImageAnimation(this.sprite, assets.animation`dragonFlyRight`, 35, true)
    }
    flyLeft(velocity: number) {
        animation.runImageAnimation(this.sprite, assets.animation`dragonTurnLeft`, 35, false)
        this.sprite.vx = -(Math.abs(velocity))
        animation.runImageAnimation(this.sprite, assets.animation`dragonFlyLeft`, 35, true)
    }
    flyDown(velocity: number) {
        this.sprite.vy = -(Math.abs(velocity))
    }
    flyUp(velocity: number) {
        this.sprite.vy = -(Math.abs(velocity))
    }
    collums() {
        if (this.sprite.isHittingTile(CollisionDirection.Left)) {
            this.flyRight(100)
        }
        if (this.sprite.isHittingTile(CollisionDirection.Right)) {
            this.flyLeft(100)
        }
        if (this.sprite.isHittingTile(CollisionDirection.Bottom)) {
            this.flyUp(Math.randomRange(0, 20))
        }
        if (this.sprite.isHittingTile(CollisionDirection.Top)) {
            this.flyDown(Math.randomRange(0, 20))
        }
    }
    createBossBar() {
        this.health.setColor(3, 4, 2)
        this.health.setOffsetPadding(-10, 5)
        this.health.setBarBorder(10, 6)
        this.health.positionDirection(CollisionDirection.Top)
        this.health.setLabel("Jane", 13)
    }
}
let inventory = new Inventory
let map: number[][] = []
let endTilemap: tiles.TileMapData = null
let lilMap: Image = null
let enderDragon = new EnderDragon
let steveDirection = "right"
scene.setBackgroundImage(assets.image`voidImage`)
endTilemap = tilemap`bigMap`
tiles.setCurrentTilemap(endTilemap)
lilMap = assets.image`littleMap`
generateMap(lilMap.height, lilMap.width)
createSteve()
//
// M  O  V  E  M  E  N  T    E  V  E  N  T    L  I  S  T  E  N  E  R  S
game.onUpdate(function () {
    if (controller.up.isPressed()) {
        if (steve.isHittingTile(CollisionDirection.Bottom)) {
            steve.vy = -155
        }
    }
    if (controller.down.isPressed()) {
        if (inventory.heldItem == 8) {
            inventory.heldItem = 0
        } else {
            timer.throttle("action", 300, function () {
                inventory.heldItem++
            })

        }
    }
    if (controller.right.isPressed()) {
        steve.vx = 50
        timer.throttle("actionl", 900, function () {
            animation.stopAnimation(animation.AnimationTypes.All, steve)
            animation.runImageAnimation(steve, assets.animation`steveWalkingRight`, 100, true)
            steveDirection = "right"
        })
    }
    if (controller.left.isPressed()) {
        steve.vx = -50
        timer.throttle("action", 900, function () {
            animation.stopAnimation(animation.AnimationTypes.All, steve)
            animation.runImageAnimation(steve, assets.animation`steveWalkingLeft`, 100, true)
            steveDirection = "left"
        })

    }
    if ((!controller.right.isPressed()) && (!controller.left.isPressed())) {
        steve.vx = 0
        animation.stopAnimation(animation.AnimationTypes.All, steve)
    }
})
//              D   R   A   G   O   N     A   I
game.onUpdateInterval(500, function () {
    let steveDist = Math.sqrt((steve.x - enderDragon.sprite.x) ** 2 + (steve.y - enderDragon.sprite.y) ** 2)
    if (steveDist <= 60) {
        /* enderDragon.flyLeft(100) */
    } else {
        enderDragon.collums()
    }
})
//  Inventory Render
game.onUpdate(function () {
    inventory.inventorySprite.setPosition(scene.cameraProperty(CameraProperty.X), scene.cameraProperty(CameraProperty.Y) + 49)
    inventory.render()
})
