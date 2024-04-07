import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events, PTL_PlatformType } from "../../ptl_enums";
import GameLevel from "./GameLevel";

export default class Level1 extends GameLevel {
    protected levelEndAreaIsSet: boolean = false;
    protected timer: Timer;
    
    loadScene(): void {
        // Load resources
        this.load.tilemap("level1", "assets/tilemaps/level1.json");
        this.load.spritesheet("player", "assets/sprites/stanfordTree.json");
        this.load.spritesheet("basic", "assets/sprites/basicPlatform.json");
        this.load.spritesheet("bouncy", "assets/sprites/bouncyPlatform.json");
        this.load.spritesheet("moving", "assets/sprites/movingPlatform.json");
        this.load.spritesheet("red", "assets/sprites/redPlatform.json");
        this.load.spritesheet("blue", "assets/sprites/bluePlatform.json");
        this.load.spritesheet("green", "assets/sprites/greenPlatform.json");
        this.load.spritesheet("trap", "assets/sprites/trapDoorPlatform.json");
    }

    unloadScene(){
        // Keep resources - this is up to you
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 64*32, 20*32);

        this.playerSpawn = new Vec2(5*32, 14*32);

        // Do generic setup for a GameLevel
        super.startScene();

        this.addPlatform("red", new Vec2 (16, 10), {color: PTL_Color.RED, type: PTL_PlatformType.COLORED});
        this.addPlatform("blue", new Vec2 (20, 10), {color: PTL_Color.BLUE, type: PTL_PlatformType.COLORED});
        this.addPlatform("green", new Vec2 (24, 10), {color: PTL_Color.GREEN, type: PTL_PlatformType.COLORED});
        this.addPlatform("trap", new Vec2 (12, 16), {type: PTL_PlatformType.TRAPDOOR});
        this.addPlatform("trap", new Vec2 (34, 13), {type: PTL_PlatformType.TRAPDOOR});
        this.addPlatform("trap", new Vec2 (38, 13), {type: PTL_PlatformType.TRAPDOOR});

    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}