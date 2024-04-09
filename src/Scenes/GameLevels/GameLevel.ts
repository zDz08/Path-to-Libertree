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
import Label, { HAlign } from "../../Wolfie2D/Nodes/UIElements/Label";
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
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import ButtonFactory from "../../UIElements/ButtonFactory";
import Level1 from "./Level1";

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
    protected delayTimer: Timer;

    // The remaining number of platforms
    protected totalZs: number;
    protected totalXs: number;
    protected totalCs: number;

    // for counting the number of platforms
    protected zLabel: Label;
    protected xLabel: Label;
    protected cLabel: Label;

    // for highlighting selected platforms
    protected zBox: Label;
    protected xBox: Label;
    protected cBox: Label;

    protected pause1: Button;
    protected pause2: Button;
    protected theme_dark_green: Color = new Color(38, 70, 12);
    protected theme_lighter_green: Color = new Color(179, 191, 164);
    protected theme_light_green: Color = new Color(94, 121, 60);
    
    protected isPaused: boolean;
    protected keyNum: Number = 0;
    protected keyLabel: Label;
    protected balloonLabel: Label;

    // Total switches and amount currently pressed
    protected totalSwitches: number;
    protected switchLabel: Label;
    protected switchesPressed: number;

    protected currentPlatformType: string;

    loadScene(): void {
        this.load.image("basic_icon", "assets/sprites/basicPlatform.png");
        this.load.image("bouncy_icon", "assets/sprites/bouncyPlatform.png");
        this.load.image("moving_icon", "assets/sprites/movingPlatform.png");
    }

    startScene(): void {
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
        this.delayTimer = new Timer(1700, () => {
            this.respawnPlayer();
        });

        // Initially disable player movement
        Input.disableInput();
        this.emitter.fireEvent(PTL_Events.SUIT_COLOR_CHANGE, {color: PTL_Color.GREEN});
        Input.enableInput();

    }


    updateScene(deltaT: number){
        // Handle events and update the UI if needed
        if (this.isPaused){
            Input.disableInput();
            this.receiver.ignoreEvents();
        }
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
                        if(!this.delayTimer.hasRun() && this.delayTimer.isStopped()){
                            this.delayTimer.start();
                        }
                        break;
                    }
                case PTL_Events.LEVEL_PAUSE:
                    {
                        this.isPaused = true;
                        this.pauseUI();
                    }
                    break;
            }
        }
        if (!this.isPaused){
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
                    this.zBox.borderColor = this.theme_dark_green;
                    this.xBox.borderColor = this.theme_lighter_green;
                    this.cBox.borderColor = this.theme_lighter_green;
                    this.suitChangeTimer.start();
                }
                else if (Input.isKeyJustPressed("x")) {
                    this.currentPlatformType = "bouncy";
                    this.zBox.borderColor = this.theme_lighter_green;
                    this.xBox.borderColor = this.theme_dark_green;
                    this.cBox.borderColor = this.theme_lighter_green;
                    this.suitChangeTimer.start();
                }
                else if (Input.isKeyJustPressed("c")) {
                    this.currentPlatformType = "moving";
                    this.zBox.borderColor = this.theme_lighter_green;
                    this.xBox.borderColor = this.theme_lighter_green;
                    this.cBox.borderColor = this.theme_dark_green;
                    this.suitChangeTimer.start();
                }
                if (Input.isKeyJustPressed("p")){
                    this.emitter.fireEvent(PTL_Events.LEVEL_PAUSE);
                }
            }
            if (Input.isMouseJustPressed(0) && !this.player.onGround && !this.player.onWall) {
                if(this.currentPlatformType == "basic" && this.totalZs > 0) {
                    this.emitter.fireEvent(PTL_Events.SPAWN_PLATFORM, {type: PTL_PlatformType.BASIC});
                    this.totalZs--;
                    this.zLabel.text = this.totalZs.toString();
                }else if(this.currentPlatformType == "bouncy" && this.totalXs > 0) {
                    this.emitter.fireEvent(PTL_Events.SPAWN_PLATFORM, {type: PTL_PlatformType.BOUNCY});
                    this.totalXs--;
                    this.xLabel.text = this.totalXs.toString();
                }else if(this.currentPlatformType ==  "moving" && this.totalCs > 0) {
                    this.emitter.fireEvent(PTL_Events.SPAWN_PLATFORM, {type: PTL_PlatformType.MOVING});
                    this.totalCs--;
                    this.cLabel.text = this.totalCs.toString();
                }
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

        // add a layer for platform icons
        this.addLayer("platform_icons", 0)
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
            PTL_Events.LEVEL_PAUSE,
            PTL_Events.PLAYER_KILLED,
            PTL_Events.PLAYER_ON_PLATFORM,
            PTL_Events.SPAWN_PLATFORM
        ]);
    }

    /**
     * Adds in any necessary UI to the game
     */
    protected addUI(){
        // In-game labels
        const startPosX = 7;
        const startPosY = 10;
        const boxWidth = 100;
        const boxHeight = 24;
        const fontSize = 20;
        const borderWidth = 2.5;
        const letterLabels = ["Z", "X", "C"];
        const platformIcons = ["basic_icon", "bouncy_icon", "moving_icon"]
        const counts = [this.totalZs, this.totalXs, this.totalCs];

        let boxes = []
        let labels = []
        for(let i = 0; i < 3; i++){
            let box = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(startPosX+boxWidth/2, startPosY+boxHeight*i+borderWidth*2), text: ""});
            box.size.set(boxWidth*2, boxHeight*2-borderWidth);
            box.backgroundColor = new Color(217,217,217,1);
            box.borderColor = this.theme_lighter_green;
            box.borderWidth = borderWidth;
            box.fontSize = boxHeight;
            boxes.push(box);

            let letter = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(startPosX+5, startPosY+boxHeight*(i+1)+borderWidth*2-fontSize+2), text: letterLabels[i]});
            letter.fontSize = fontSize;
            letter.font = "Bungee";
            letter.textColor = Color.BLACK;

            let count = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(startPosX + boxWidth- 5, startPosY+boxHeight*(i+1)+borderWidth*2-fontSize+2), text: counts[i].toString()});
            count.fontSize = fontSize;
            count.font = "Bungee";
            count.textColor = this.theme_light_green;
            labels.push(count);

            let icon = this.add.sprite(platformIcons[i], "UI");
            icon.scale.set(.25,.25);
            icon.position.copy(new Vec2(startPosX+boxWidth/2,startPosY+boxHeight*i+borderWidth*2));
        }

        this.zLabel = labels[0];
        this.xLabel = labels[1];
        this.cLabel = labels[2];

        this.zBox = boxes[0];
        this.xBox = boxes[1];
        this.cBox = boxes[2];

        const halfSize = this.viewport.getHalfSize();
        this.pause1 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(halfSize.x*2-20, boxHeight/2), text: ""});
        this.pause2 = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(halfSize.x*2-10, boxHeight/2), text: ""});
        this.pause1.size.set(10, boxHeight+5);
        this.pause1.backgroundColor = Color.WHITE;
        this.pause1.borderRadius = 3;
        this.pause1.borderColor = this.theme_dark_green;
        this.pause1.borderWidth = 2;
        this.pause2.size.set(10, boxHeight+5);
        this.pause2.backgroundColor =  Color.WHITE;
        this.pause2.borderRadius = 3;
        this.pause2.borderColor = this.theme_dark_green;
        this.pause2.borderWidth = 2;

        let pauseButton = <Button>this.add.uiElement(UIElementType.BUTTON, "UI", {position: new Vec2(halfSize.x*2-15, boxHeight/2), text: ""});
        pauseButton.size.set(30, boxHeight+5);
        pauseButton.backgroundColor = Color.TRANSPARENT;
        pauseButton.borderColor = Color.TRANSPARENT;
        pauseButton.onEnter = () => {
            if(Input.isMouseJustPressed(0)) {
                this.emitter.fireEvent(PTL_Events.LEVEL_PAUSE);
            }
        }

        this.keyLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(halfSize.x*2-24, boxHeight/2+20), text: "KEY : " + this.keyNum});
        this.keyLabel.font = "Bungee";
        this.keyLabel.fontSize = fontSize;
        this.keyLabel.textColor = Color.BLACK;

        // Create our particle system and initialize the pool
        this.system = new PTL_ParticleSystem(100, new Vec2((5 * 32), (10 * 32)), 2000, 3, 1, 100);
        this.system.initializePool(this, "primary");
        this.system.changeColor(new Color(128, 124, 124));
    }

    protected pauseUI(){
        this.pause1.backgroundColor = this.theme_dark_green;
        this.pause2.backgroundColor = this.theme_dark_green;
        const halfSize = this.viewport.getHalfSize()
        const buttonHeight = 40;
        const startPosY = halfSize.y-60;
        let box = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: halfSize, text: ""});
        box.size.copy(halfSize).scale(2);
        box.backgroundColor = this.theme_dark_green;
        box.borderRadius = 15;
        let pauseLabel = <Label>this.add.uiElement(UIElementType.LABEL, "UI", {position: new Vec2(halfSize.x, startPosY), text: "Paused"});
        pauseLabel.textColor = Color.WHITE;
        pauseLabel.fontSize = 48;
        pauseLabel.font = "BlackChancery";
        let buttonFactory = new ButtonFactory(260, 50);
        let resume = buttonFactory.makeButton(this.add, "UI", new Vec2(halfSize.x, startPosY+buttonHeight), "Resume");
        let restart = buttonFactory.makeButton(this.add, "UI", new Vec2(halfSize.x, startPosY+2*(buttonHeight)), "Restart");
        let main = buttonFactory.makeButton(this.add, "UI", new Vec2(halfSize.x, startPosY+3*(buttonHeight)), "Back to Main Menu");
        resume.onEnter = () => {
            if(Input.isMouseJustPressed(0)) {
                this.isPaused = false;
                box.destroy();
                pauseLabel.destroy();
                resume.destroy();
                restart.destroy();
                main.destroy();
                this.pause1.backgroundColor = Color.WHITE;
                this.pause2.backgroundColor = Color.WHITE;
                this.emitter.fireEvent(PTL_Events.LEVEL_START)
            }
        }
        restart.onEnter = () => {
            if(Input.isMouseJustPressed(0)) {
                this.isPaused = false;
                if(Input.isMouseJustPressed(0)) {
                    this.pause1.backgroundColor = Color.WHITE;
                    this.pause2.backgroundColor = Color.WHITE;
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
                    this.sceneManager.changeToScene(Level1, {}, sceneOptions);
                }
            }
        }
        main.onEnter = () => {
            if(Input.isMouseJustPressed(0)) {
                this.sceneManager.changeToScene(MainMenu, {});
            }
        }
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
        if(spriteKey == "h_deadly") {
            platform.scale.set(0.25, 0.3);
            platform.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 14)));
        }else if(spriteKey == "v_deadly") {
            platform.scale.set(0.3, 0.25);
            platform.addPhysics(new AABB(Vec2.ZERO, new Vec2(14, 32)));
        }else {
            platform.scale.set(0.25, 0.3);
            platform.addPhysics(new AABB(Vec2.ZERO, new Vec2(32, 6)));
        }
        platform.setTrigger("player", PTL_Events.PLAYER_ON_PLATFORM, null);
        platform.addAI(PlatformController, aiOptions);
        platform.setGroup("platform");
    }

    protected handlePlayerPlatformCollision(player: AnimatedSprite, platform: AnimatedSprite) {
        if(platform) {
            let platformAI = <PlatformController>platform.ai;
            let playerAI = (<PlayerController>player.ai);
            let a = platformAI.owner.position.y > this.player.position.y;
            if(platformAI.type == PTL_PlatformType.BOUNCY && a) {
                playerAI.onBouncy = true;
            }else if(platformAI.type == PTL_PlatformType.MOVING && a){
                if(!platformAI.owner.onWall)
                    playerAI.onMoving = true;
                playerAI.pos = platformAI.velocity.x;
            }else if(platformAI.type == PTL_PlatformType.TRAPDOOR && a) {
                platformAI.trap = true;
                platformAI.system = this.system;
            }else if(platformAI.type == PTL_PlatformType.DEADLY) {
                Input.disableInput();
                playerAI.onDeadly = true;
                this.emitter.fireEvent(PTL_Events.PLAYER_KILLED);
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
        //GameLevel.livesCount = 3;
        //this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "level_music"});
        this.sceneManager.changeToScene(MainMenu, {});
        Input.enableInput();
        this.system.stopSystem();
    }
}