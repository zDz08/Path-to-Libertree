import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Timer from "../../Wolfie2D/Timing/Timer";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events, PTL_PlatformType } from "../../ptl_enums";
import GameLevel from "./GameLevel";
import Level3 from "./Level3";
import Level4 from "./Level4";

export default class Level2 extends GameLevel {
    protected levelEndAreaIsSet: boolean = false;
    protected timer: Timer;
    
    loadScene(): void {
        // Load resources
        this.load.tilemap("level2", "assets/tilemaps/level2/level2.json");
        this.load.tilemap("level2parallax", "assets/tilemaps/level2/level2parallax.json");
        this.load.tilemap("level2collidable", "assets/tilemaps/level2/level2collidable.json");

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
        this.load.spritesheet("indicator","assets/sprites/keyIndicator.json");
        this.load.spritesheet("door","assets/sprites/door.json");
        this.load.spritesheet("enemy", "assets/sprites/beholder/beholder.json");
        this.load.audio("level_music", "assets/music/easy_level_music.wav");
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

    protected initLayers(): void {
        super.initLayers();
    }
    startScene(): void {
        // Add the level 1 tilemap
        this.add.tilemap("level2", new Vec2(2, 2));
        this.add.tilemap("level2parallax", new Vec2(2, 2));
        this.add.tilemap("level2collidable", new Vec2(2, 2));
        this.viewport.setBounds(0, 0, 1024, 1024);
        this.playerSpawn = new Vec2(128, 824);

        this.totalZs = 3;
        this.totalXs = 2;
        this.totalCs = 2;
        this.keyNum = 3;

        this.setPassedLevels([1, 1]);

        // Do generic setup for a GameLevel
        super.startScene();

        this.addEnemy("enemy", new Vec2(6, 27), {tilemap: "Collidable"})
        this.addEnemy("enemy", new Vec2(15, 24), {tilemap: "Collidable"})
        this.addPlatform("trap", new Vec2 (12, 26.5), {type: PTL_PlatformType.TRAPDOOR});
        this.addPlatform("trap", new Vec2 (21, 23.5), {type: PTL_PlatformType.TRAPDOOR});
        this.addPlatform("v_deadly", new Vec2 (24, 4.5), {type: PTL_PlatformType.DEADLY});
        this.addKey("key", new Vec2(9.5, 14.5));
        this.addKey("key", new Vec2(14, 7.5));
        this.addKey("key", new Vec2(31, 31));
        this.addIndicator("indicator");
        this.addLevelEnd("door", new Vec2(27, 4.5));
        this.currentLevel = Level2;
        this.nextLevel = Level3;

        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "level_music", loop: true, holdReference: true});
    }

    updateScene(deltaT: number): void {
        super.updateScene(deltaT);
    }
}