import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events, PTL_PlatformType } from "../../ptl_enums";
import GameLevel from "./GameLevel";
import Level2 from "./Level2";

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
        this.load.spritesheet("h_deadly", "assets/sprites/horizontalDeadlyPlatform.json");
        this.load.spritesheet("v_deadly", "assets/sprites/verticalDeadlyPlatform.json");
        this.load.spritesheet("key","assets/sprites/key.json");
        this.load.spritesheet("door","assets/sprites/door.json");
        this.load.spritesheet("enemy", "assets/sprites/beholder/beholder.json");
        this.load.audio("level_music", "/dist/assets/music/easy_level_music.wav");
        this.load.audio("jump_sound", "/dist/assets/sounds/jump_sound.wav");
        this.load.audio("bouncy_sound", "/dist/assets/sounds/bouncy_sound.wav");
        this.load.audio("key_collect_sound", "/dist/assets/sounds/key_collect_sound.wav");
        this.load.audio("death_sound2", "/dist/assets/sounds/death_sound2.wav");
        this.load.audio("level_complete", "/dist/assets/sounds/level_complete.wav");
        super.loadScene();
    }

    unloadScene(){
        // Keep resources - this is up to you
    }

    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level1", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 1024, 1024);
        this.playerSpawn = new Vec2(128, 824);
        
        this.totalZs = 3;
        this.totalXs = 3;
        this.totalCs = 3;
        this.keyNum = 4;

        // Do generic setup for a GameLevel
        super.startScene();
        this.addLevelEnd("door", new Vec2(30, 27.5));
        this.addPlatform("red", new Vec2 (16, 10), {color: PTL_Color.RED, type: PTL_PlatformType.COLORED});
        this.addPlatform("h_deadly", new Vec2 (17, 30), {type: PTL_PlatformType.DEADLY});
        this.addPlatform("v_deadly", new Vec2 (14, 15), {type: PTL_PlatformType.DEADLY});
        this.addKey("key", new Vec2(17, 27));
        this.addKey("key", new Vec2(28, 28));
        this.addKey("key", new Vec2(20, 6));
        this.addKey("key", new Vec2(4, 1));
        this.addEnemy("enemy", new Vec2(10, 29.5), {tilemap: "Collidable"})
        this.currentLevel = Level1;
        this.nextLevel = Level2;
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}