import GameNode from "../Wolfie2D/Nodes/GameNode";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../Wolfie2D/AI/StateMachineAI";
import { PTL_Events, PTL_PlatformType } from "../ptl_enums";
import Rigid from "./Rigid";
import { PTL_Color } from "../ptl_color";
import Moving from "./Moving";
import Crash from "./Crash";
import ptl_ParticleSystem from "../ptl_ParticleSystem";

export enum PlatformStates {
	RIGID = "rigid",
	MOVING = "moving",
	CRASH = "Crash"
}

export default class PlatformController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = Vec2.ZERO;
	velocity: Vec2 = Vec2.ZERO;
	speed: number = 100;
	ySpeed: number = 700;
	gravity: number = 1000;
	color: PTL_Color;
	type: PTL_PlatformType;
	trap: boolean;
	system: ptl_ParticleSystem;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;

		this.receiver.subscribe(PTL_Events.PLAYER_MOVE);
		this.receiver.subscribe(PTL_Events.SUIT_COLOR_CHANGE);

		let rigid = new Rigid(this, owner);
		this.addState(PlatformStates.RIGID, rigid);
		let moving = new Moving(this, owner);
		this.addState(PlatformStates.MOVING, moving);
		let crash = new Crash(this, owner);
		this.addState(PlatformStates.CRASH, crash);

		this.color = options.color;
		this.type = options.type;
		this.direction = new Vec2(1, 0);

		this.initialize(PlatformStates.RIGID);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}
}