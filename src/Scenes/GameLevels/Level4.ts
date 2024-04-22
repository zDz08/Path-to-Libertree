import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events, PTL_PlatformType } from "../../ptl_enums";
import GameLevel from "./GameLevel";

export default class Level4 extends GameLevel {
    protected levelEndAreaIsSet: boolean = false;
    protected timer: Timer;
    
    loadScene(): void {
        // Load resources
        this.load.tilemap("level4", "assets/tilemaps/level4.json");
        this.load.spritesheet("player", "assets/sprites/stanfordTree.json");
        this.load.spritesheet("basic", "assets/sprites/basicPlatform.json");
        this.load.spritesheet("bouncy", "assets/sprites/bouncyPlatform.json");
        this.load.spritesheet("moving", "assets/sprites/movingPlatform.json");
        this.load.spritesheet("red", "assets/sprites/redPlatform.json");
        this.load.spritesheet("blue", "assets/sprites/bluePlatform.json");
        this.load.spritesheet("green", "assets/sprites/greenPlatform.json");
        this.load.spritesheet("trap", "assets/sprites/trapDoorPlatform.json");
        this.load.spritesheet("h_deadly", "assets/sprites/horizontalDeadlyPlatform.json");
        this.load.spritesheet("v_deadly", "assets/sprites/verticalDeadlyPlatform.json");
        this.load.spritesheet("key","assets/sprites/key.json");
        this.load.spritesheet("door","assets/sprites/door.json");
        super.loadScene();
    }

    unloadScene(){
        // Keep resources - this is up to you
    }

    startScene(): void {
        // Add the level 4 tilemap
        this.add.tilemap("level4", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 1024, 1024);
        this.playerSpawn = new Vec2(128, 824);
        
        this.totalZs = 2;
        this.totalXs = 3;
        this.totalCs = 2;
        this.keyNum = 8;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd("door", new Vec2(30, 1.5));
        for(let pos of [new Vec2 (26, 29)]) {
            this.addPlatform("red", pos, {color: PTL_Color.RED, type: PTL_PlatformType.COLORED});
        }
        for(let pos of [new Vec2 (13, 28)]) {
            this.addPlatform("blue", pos, {color: PTL_Color.BLUE, type: PTL_PlatformType.COLORED});
        }
        for(let pos of [new Vec2 (30, 25), new Vec2 (30, 22.5), new Vec2 (30, 20)]) {
            this.addPlatform("green", pos, {color: PTL_Color.GREEN, type: PTL_PlatformType.COLORED});
        }
        for(let pos of [new Vec2 (9, 28), new Vec2 (22, 26.5), new Vec2 (12, 12), 
                        new Vec2 (8, 10), new Vec2 (12, 8), new Vec2 (8, 6)]) {
            this.addPlatform("trap", pos, {type: PTL_PlatformType.TRAPDOOR});
        }
        for(let pos of [new Vec2 (11, 29), new Vec2 (13, 29), 
                        new Vec2(26, 21), new Vec2(24, 21), new Vec2(22, 21), new Vec2(20, 18.5), new Vec2(18, 18.5), 
                        new Vec2(26, 17), new Vec2(24, 17), new Vec2(22, 14.5), new Vec2(23, 3)]) {
            this.addPlatform("h_deadly", pos, {type: PTL_PlatformType.DEADLY});
        }
        for(let pos of [new Vec2 (11, 27), new Vec2 (16, 29), new Vec2(28, 21), 
                        new Vec2(32, 21), new Vec2(20.5, 20), new Vec2(23.5, 15.5), 
                        new Vec2(17.5, 17), new Vec2(17.5, 15)]) {
            this.addPlatform("v_deadly", pos, {type: PTL_PlatformType.DEADLY});
        }
        for(let pos of [new Vec2(14.5, 29), new Vec2(26, 28), new Vec2(30, 26), 
                        new Vec2(22, 19), new Vec2(21, 13), new Vec2(5.5, 4), 
                        new Vec2(23, 4), new Vec2(23, 1.5)]) {
            this.addKey("key", pos);
        }
        this.currentLevel = Level4;
        this.nextLevel = Level4;
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}