import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Debug from "../../Wolfie2D/Debug/Debug";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import { TweenableProperties } from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Point from "../../Wolfie2D/Nodes/Graphics/Point";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import { EaseFunctionType } from "../../Wolfie2D/Utils/EaseFunctions";
import PlatformController from "../../Platforms/PlatformController";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events, PTL_PlatformType } from "../../ptl_enums";
import PTL_ParticleSystem from "../../ptl_ParticleSystem";
import PlayerController from "../../Player/PlayerController";
import MainMenu from "../NavigationScreens/MainMenu";

export default class GameLevel extends Scene {
    // Every level will have a player, which will be an animated sprite
    protected playerSpawn: Vec2;
    protected player: AnimatedSprite;
    protected respawnTimer: Timer;

    // Labels for the UI
    protected static livesCount: number = 3;
    protected livesCountLabel: Label;

    // Stuff to end the level and go to the next level
    protected levelEndArea: Rect;
    protected nextLevel: new (...args: any) => GameLevel;
    protected levelEndTimer: Timer;
    protected levelEndLabel: Label;
    
    // Screen fade in/out for level start and end
    protected levelTransitionTimer: Timer;
    protected levelTransitionScreen: Rect;
    
    // Custom particle sysyem
    protected system: PTL_ParticleSystem;

    // Cooldown timer for changing suits
    protected suitChangeTimer: Timer;

    // Total ballons and amount currently popped
    protected totalBalloons: number;
    protected balloonLabel: Label;
    protected balloonsPopped: number;

    // Total switches and amount currently pressed
    protected totalSwitches: number;
    protected switchLabel: Label;
    protected switchesPressed: number;

    protected currentPlatformType: string;

    startScene(): void {
        this.balloonsPopped = 0;
        this.switchesPressed = 0;

        // Do the game level standard initializations
        this.initLayers();
        this.initViewport();
        this.initPlayer();
        this.subscribeToEvents();
        this.addUI();

        // Initialize the timers
        this.respawnTimer = new Timer(1000, () => {
            if(GameLevel.livesCount === 0){
                this.sceneManager.changeToScene(MainMenu);
            } else {
                this.respawnPlayer();
                this.player.enablePhysics();
                this.player.unfreeze();
            }
        });
        this.levelTransitionTimer = new Timer(500);
        this.levelEndTimer = new Timer(3000, () => {
            // After the level end timer ends, fade to black and then go to the next scene
           // this.levelTransitionScreen.tweens.play("fadeIn");
        });

        // 1 second cooldown for changing suits
        this.suitChangeTimer = new Timer(1000);

        // Initially disable player movement
        Input.disableInput();
        this.emitter.fireEvent(PTL_Events.SUIT_COLOR_CHANGE, {color: PTL_Color.GREEN});
        Input.enableInput();
    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        while(this.receiver.hasNextEvent()){
            let event = this.receiver.getNextEvent();
            
            switch(event.type){

                case PTL_Events.PLAYER_ON_PLATFORM:
                    {
                        let node = this.sceneGraph.getNode(event.data.get("node"));
                        let other = this.sceneGraph.getNode(event.data.get("other"));

                        if(node === this.player){
                            // Node is player, other is platform
                            this.handlePlayerPlatformCollision(<AnimatedSprite>node, <AnimatedSprite>other);
                        } else {
                            // Other is player, node is platform
                            this.handlePlayerPlatformCollision(<AnimatedSprite>other,<AnimatedSprite>node);

                        }
                    }
                    break;

                case PTL_Events.SPAWN_PLATFORM:
                    {
                        let pos = new Vec2(this.player.position.x / 32, (this.player.position.y+32) / 32);
                        this.addPlatform(this.currentPlatformType, pos, {type: event.data.get("type")});
                    }
                    break;

                case PTL_Events.LEVEL_START:
                    {
                        // Re-enable controls
                        Input.enableInput();
                    }
                    break;
                
                case PTL_Events.LEVEL_END:
                    {
                        // Go to the next level
                        if(this.nextLevel){
                            let sceneOptions = {
                                physics: {
                                    groupNames: ["ground", "player", "platform"],
                                    collisions:
                                    [
                                        [0, 1, 1],
                                        [1, 0, 1],
                                        [1, 1, 0]
                                    ]
                                }
                            }
                            this.sceneManager.changeToScene(this.nextLevel, {}, sceneOptions);
                        }
                    }
                    break;
                case PTL_Events.PLAYER_KILLED:
                    {
                        this.respawnPlayer();
                    }

            }
        }

        /**
         * Pressing 1 switches our suit to RED
         * Pressing 2 switches our suit to BLUE
         * Pressing 3 switches our suit to GREEN
         */
        if (this.suitChangeTimer.isStopped()) {
            if (Input.isKeyJustPressed("1")) {
                this.emitter.fireEvent(PTL_Events.SUIT_COLOR_CHANGE, {color: PTL_Color.GREEN});
                this.suitChangeTimer.start();
            }
            if (Input.isKeyJustPressed("2")) {
                this.emitter.fireEvent(PTL_Events.SUIT_COLOR_CHANGE, {color: PTL_Color.RED});
                this.suitChangeTimer.start();
            }
            if (Input.isKeyJustPressed("3")) {
                this.emitter.fireEvent(PTL_Events.SUIT_COLOR_CHANGE, {color: PTL_Color.BLUE});
                this.suitChangeTimer.start();
            }
            if (Input.isKeyJustPressed("z")) {
                this.currentPlatformType = "basic";
                this.suitChangeTimer.start();
            }
            if (Input.isKeyJustPressed("x")) {
                this.currentPlatformType = "bouncy";
                this.suitChangeTimer.start();
            }
            if (Input.isKeyJustPressed("c")) {
                this.currentPlatformType = "moving";
                this.suitChangeTimer.start();
            }
        }
        if (Input.isMouseJustPressed(0) && !this.player.onGround && !this.player.onWall) {
            if(this.currentPlatformType == "basic") {
                this.emitter.fireEvent(PTL_Events.SPAWN_PLATFORM, {type: PTL_PlatformType.BASIC});
            }else if(this.currentPlatformType == "bouncy") {
                this.emitter.fireEvent(PTL_Events.SPAWN_PLATFORM, {type: PTL_PlatformType.BOUNCY});
            }else if(this.currentPlatformType ==  "moving") {
                this.emitter.fireEvent(PTL_Events.SPAWN_PLATFORM, {type: PTL_PlatformType.MOVING});
            }
        }
    }

    /**
     * Initialzes the layers
     */
    protected initLayers(): void {
        // Add a layer for UI
        this.addUILayer("UI");

        // Add a layer for players and enemies
        this.addLayer("primary", 1);
    }

    /**
     * Initializes the viewport
     */
    protected initViewport(): void {
        this.viewport.setZoomLevel(2);
    }

    /**
     * Handles all subscriptions to events
     */
    protected subscribeToEvents(){
        this.receiver.subscribe([
            PTL_Events.LEVEL_START,
            PTL_Events.LEVEL_END,
            PTL_Events.PLAYER_KILLED,
            PTL_Events.PLAYER_ON_PLATFORM,
            PTL_Events.SPAWN_PLATFORM
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){

        // Create our particle system and initialize the pool
        this.system = new PTL_ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.system.initializePool(this, "primary");
        this.system.changeColor(new Color(128, 124, 124));
    }

    /**
     * Initializes the player
     */
    protected initPlayer(): void {
        // Add the player
        this.player = this.add.animatedSprite("player", "primary");
        this.player.scale.set(0.3, 0.3);
        if(!this.playerSpawn){
            console.warn("Player spawn was never set - setting spawn to (0, 0)");
            this.playerSpawn = Vec2.ZERO;
        }
        this.player.position.copy(this.playerSpawn);
        this.player.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 14)));
        this.player.colliderOffset.set(0, 2);
        this.player.addAI(PlayerController, {playerType: "platformer", tilemap: "Main", color: PTL_Color.GREEN});

        this.player.setGroup("player");

        this.viewport.follow(this.player);
    }

    protected addPlatform(spriteKey: string, tilePos: Vec2, aiOptions: Record<string, any>): void {
        let platform = this.add.animatedSprite(spriteKey, "primary");
        platform.position.set(tilePos.x*32, tilePos.y*32);
        platform.scale.set(0.3, 0.3);
        platform.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 6)));
        platform.setTrigger("player", PTL_Events.PLAYER_ON_PLATFORM, null);
        platform.addAI(PlatformController, aiOptions);
        platform.setGroup("platform");
    }

    protected handlePlayerPlatformCollision(player: AnimatedSprite, platform: AnimatedSprite) {
        if(platform) {
            if((<PlatformController>platform.ai).type == PTL_PlatformType.BOUNCY) {
                (<PlayerController>player.ai).onBouncy = true;
            }else if((<PlatformController>platform.ai).type == PTL_PlatformType.MOVING){
                if(!(<PlatformController>platform.ai).owner.onWall)
                    (<PlayerController>player.ai).onMoving = true;
                (<PlayerController>player.ai).pos = (<PlatformController>platform.ai).velocity.x;
            }else {
                if((<PlatformController>platform.ai).type == PTL_PlatformType.TRAPDOOR) {
                    (<PlatformController>platform.ai).trap = true;
                    (<PlatformController>platform.ai).system = this.system;
                }
                this.player.onGround = true;
            }
        }
    }

    /**
     * Increments the amount of life the player has
     * @param amt The amount to add to the player life
     */
    protected incPlayerLife(amt: number): void {
        GameLevel.livesCount += amt;
        this.livesCountLabel.text = "Lives: " + GameLevel.livesCount;
        if (GameLevel.livesCount == 0){
            Input.disableInput();
            this.player.disablePhysics();
            this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "player_death", loop: false, holdReference: false});
            this.player.tweens.play("death");
        }
    }

    /**
     * Returns the player to spawn
     */
    protected respawnPlayer(): void {
        GameLevel.livesCount = 3;
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainMenu, {});
        Input.enableInput();
        this.system.stopSystem();
    }
}