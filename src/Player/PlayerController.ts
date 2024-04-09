import StateMachineAI from "../Wolfie2D/AI/StateMachineAI";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Debug from "../Wolfie2D/Debug/Debug";
import GameNode, { TweenableProperties } from "../Wolfie2D/Nodes/GameNode";
import Sprite from "../Wolfie2D/Nodes/Sprites/Sprite";
import OrthogonalTilemap from "../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { EaseFunctionType } from "../Wolfie2D/Utils/EaseFunctions";
import { PTL_Color } from "../ptl_color";
import { PTL_Events } from "../ptl_enums";
import Fall from "./PlayerStates/Fall";
import Idle from "./PlayerStates/Idle";
import InAir from "./PlayerStates/InAir";
import Jump from "./PlayerStates/Jump";
import Run from "./PlayerStates/Run";
import Walk from "./PlayerStates/Walk";

export enum PlayerType {
    PLATFORMER = "platformer",
    TOPDOWN = "topdown"
}

export enum PlayerStates {
    IDLE = "idle",
    WALK = "walk",
	RUN = "run",
	JUMP = "jump",
    FALL = "fall",
	PREVIOUS = "previous"
}

export default class PlayerController extends StateMachineAI {
    protected owner: GameNode;
    velocity: Vec2 = Vec2.ZERO;
	speed: number = 200;
	MIN_SPEED: number = 200;
    MAX_SPEED: number = 300;
    tilemap: OrthogonalTilemap;
    suitColor: PTL_Color;
    tilePos1: Vec2;
    tilePos2: Vec2;
    tilePos3: Vec2;
    tilePos4: Vec2;
    tilePos5: Vec2;
    tilePos6: Vec2;
    tileIndex1: number;
    tileIndex2: number;
    tileIndex3: number;
    tileIndex4: number;
    tileIndex5: number;
    tileIndex6: number;
    onBouncy: boolean;
    onMoving: boolean;
    onDeadly: boolean;
    pos: number;

    // HOMEWORK 5 - TODO
    /**
     * Implement a death animation for the player using tweens. The animation rotate the player around itself multiple times
     * over the tween duration, as well as fading out the alpha value of the player. The tween should also make use of the
     * onEnd field to send out a PLAYER_KILLED event.
     * 
     * Tweens MUST be used to create this new animation, although you can add to the spritesheet if you want to add some more detail.
     * 
     * Look at incPlayerLife() in GameLevel to see where this animation would be called.
     */
    initializeAI(owner: GameNode, options: Record<string, any>){
        this.owner = owner;

        this.initializePlatformer();

        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;

        this.suitColor = options.color;

        this.receiver.subscribe(PTL_Events.SUIT_COLOR_CHANGE);

        owner.tweens.add("flip", {
            startDelay: 0,
            duration: 0,
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 2*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });

        owner.tweens.add("death", {
            startDelay: 0,
            duration: 1500,
            onEnd: "PlayerKilled",
            effects: [
                {
                    property: "rotation",
                    start: 0,
                    end: 6*Math.PI,
                    ease: EaseFunctionType.IN_OUT_QUAD
                },
                {
                    property: "alpha",
                    start: 1,
                    end: 0,
                    ease: EaseFunctionType.IN_OUT_QUAD
                }
            ]
        });
    }

    initializePlatformer(): void {
        this.speed = 400;

        let idle = new Idle(this, this.owner);
		this.addState(PlayerStates.IDLE, idle);
		let walk = new Walk(this, this.owner);
		this.addState(PlayerStates.WALK, walk);
		let run = new Run(this, this.owner);
		this.addState(PlayerStates.RUN, run);
		let jump = new Jump(this, this.owner);
        this.addState(PlayerStates.JUMP, jump);
        let fall = new Fall(this, this.owner);
        this.addState(PlayerStates.FALL, fall);
        
        this.initialize(PlayerStates.IDLE);
    }

    changeState(stateName: string): void {
        // If we jump or fall, push the state so we can go back to our current state later
        // unless we're going from jump to fall or something
        if((stateName === PlayerStates.JUMP || stateName === PlayerStates.FALL) && !(this.stack.peek() instanceof InAir)){
            this.stack.push(this.stateMap.get(stateName));
        }

        super.changeState(stateName);
    }

    update(deltaT: number): void {
		super.update(deltaT);
        

        this.tilePos1 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x-16, this.owner.position.y+16));
        this.tilePos2 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x+16, this.owner.position.y+16));
        this.tilePos3 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x+16, this.owner.position.y-16));
        this.tilePos4 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x-16, this.owner.position.y-16));
        this.tilePos5 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y+16));
        this.tilePos6 = this.tilemap.getColRowAt(new Vec2(this.owner.position.x, this.owner.position.y-16));
        this.tileIndex1 = this.tilemap.getTileAtRowCol(this.tilePos1);
        this.tileIndex2 = this.tilemap.getTileAtRowCol(this.tilePos2);
        this.tileIndex3 = this.tilemap.getTileAtRowCol(this.tilePos3);
        this.tileIndex4 = this.tilemap.getTileAtRowCol(this.tilePos4);
        this.tileIndex5 = this.tilemap.getTileAtRowCol(this.tilePos5);
        this.tileIndex6 = this.tilemap.getTileAtRowCol(this.tilePos6);
        if(this.tileIndex1 == 1) {
            this.tilemap.setTileAtRowCol(this.tilePos1, 0);
            this.emitter.fireEvent(PTL_Events.PLAYER_OBTAINED_KEY);
        }else if(this.tileIndex2 == 1) {
            this.tilemap.setTileAtRowCol(this.tilePos2, 0);
            this.emitter.fireEvent(PTL_Events.PLAYER_OBTAINED_KEY);
        }else if(this.tileIndex3 == 1) {
            this.tilemap.setTileAtRowCol(this.tilePos3, 0);
            this.emitter.fireEvent(PTL_Events.PLAYER_OBTAINED_KEY);
        }else if(this.tileIndex4 == 1) {
            this.tilemap.setTileAtRowCol(this.tilePos4, 0);
            this.emitter.fireEvent(PTL_Events.PLAYER_OBTAINED_KEY);
        }else if(this.tileIndex5 == 1) {
            this.tilemap.setTileAtRowCol(this.tilePos5, 0);
            this.emitter.fireEvent(PTL_Events.PLAYER_OBTAINED_KEY);
        }else if(this.tileIndex6 == 1) {
            this.tilemap.setTileAtRowCol(this.tilePos6, 0);
            this.emitter.fireEvent(PTL_Events.PLAYER_OBTAINED_KEY);
        }
        

		if(this.currentState instanceof Jump){
			Debug.log("playerstate", "Player State: Jump");
		} else if (this.currentState instanceof Walk){
			Debug.log("playerstate", "Player State: Walk");
		} else if (this.currentState instanceof Run){
			Debug.log("playerstate", "Player State: Run");
		} else if (this.currentState instanceof Idle){
			Debug.log("playerstate", "Player State: Idle");
		} else if(this.currentState instanceof Fall){
            Debug.log("playerstate", "Player State: Fall");
        }
	}
}