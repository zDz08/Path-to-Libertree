import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events, PTL_PlatformType } from "../../ptl_enums";
import GameLevel from "./GameLevel";
import Level1 from "./Level1";

export default class Level6 extends GameLevel {
    protected levelEndAreaIsSet: boolean = false;
    protected timer: Timer;
    
    loadScene(): void {
        // Load resources
        this.load.tilemap("Level6", "assets/tilemaps/level6/Level6.json");
        this.load.tilemap("Parallax6", "assets/tilemaps/level6/Parallax6.json");
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
        this.load.spritesheet("enemy", "assets/sprites/beholder/beholder.json");
        this.load.audio("level_music", "assets/music/hard_level_music.mp3");
        this.load.audio("jump_sound", "assets/sounds/jump_sound.wav");
        this.load.audio("bouncy_sound", "assets/sounds/bouncy_sound.wav");
        this.load.audio("key_collect_sound", "assets/sounds/key_collect_sound.wav");
        this.load.audio("death_sound2", "assets/sounds/death_sound2.wav");
        this.load.audio("level_complete", "assets/sounds/level_complete.wav");
        super.loadScene();
    }

    unloadScene(){
        // Keep resources - this is up to you
    }

    startScene(): void {
        // Add the level 6 tilemap
        this.add.tilemap("Level6", new Vec2(2, 2));
        this.add.tilemap("Parallax6", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 1024, 1024);
        this.playerSpawn = new Vec2(80, 869);
        this.totalZs = 4;
        this.totalXs = 6;
        this.totalCs = 4;
        this.keyNum = 8;

        // Do generic setup for a GameLevel
        super.startScene();

        this.addLevelEnd("door", new Vec2(29, 6));
        for(let pos of [new Vec2(1.5, 25.25), new Vec2(1.5, 11), new Vec2(11, 28)]) {
            this.addPlatform("red", pos, {color: PTL_Color.RED, type: PTL_PlatformType.COLORED});
        }
        for(let pos of [new Vec2(4.5, 21.25), new Vec2(1.5, 13.25)]) {
            this.addPlatform("blue", pos, {color: PTL_Color.BLUE, type: PTL_PlatformType.COLORED});
        }
        for(let pos of [new Vec2(1.5, 17.25), new Vec2(13, 28)]) {
            this.addPlatform("green", pos, {color: PTL_Color.GREEN, type: PTL_PlatformType.COLORED});
        }
        for(let pos of [new Vec2(8, 6), new Vec2(4, 6), new Vec2(30, 22)]) {
            this.addPlatform("trap", pos, {type: PTL_PlatformType.TRAPDOOR});
        }
        for(let pos of [new Vec2 (11, 29), new Vec2 (13, 29), 
                        new Vec2(26, 21), new Vec2(24, 21), new Vec2(22, 21), new Vec2(20, 18.5), new Vec2(18, 18.5), 
                        new Vec2(26, 17), new Vec2(24, 17), new Vec2(22, 14.5), 
                        new Vec2(1.5, 26), new Vec2(4.5, 22), new Vec2(1.5, 18), 
                        new Vec2(1.5, 14), new Vec2(4.5, 10)]) {
            this.addPlatform("h_deadly", pos, {type: PTL_PlatformType.DEADLY});
        }
        for(let pos of [new Vec2(6, 30), new Vec2(6, 28), new Vec2(6, 26),
                        new Vec2(6, 24), new Vec2(6, 22), new Vec2(6, 20),
                        new Vec2(6, 18), new Vec2(6, 16), new Vec2(6, 14),
                        new Vec2(6, 12), new Vec2(6, 10), new Vec2(6, 8), new Vec2(6, 6),
                        new Vec2(0, 30), new Vec2(0, 28), new Vec2(0, 26),
                        new Vec2(0, 24), new Vec2(0, 22), new Vec2(0, 20),
                        new Vec2(0, 18), new Vec2(0, 16), new Vec2(0, 14),
                        new Vec2(0, 12), new Vec2(0, 10), new Vec2(0, 8), new Vec2(0, 6)
                    ]) {
            this.addPlatform("v_deadly", pos, {type: PTL_PlatformType.DEADLY});
        }
        for(let pos of [new Vec2(6, 4), new Vec2(12, 2), new Vec2(12, 27), new Vec2(1.5, 16),
                        new Vec2(24, 19), new Vec2(19, 17), new Vec2(22, 12), new Vec2(4.5 , 8)]) {
            this.addKey("key", pos);
        }
        for(let pos of [new Vec2(4, 30)]) {
            this.addEnemy("enemy", pos, {tilemap: "Collidable"});
        }
        
        this.currentLevel = Level6;
        this.nextLevel = Level1;
        this.setPassedLevels([1, 1, 1, 1, 1, 1]);
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}