import State from "../Wolfie2D/DataTypes/State/State";
import StateMachine from "../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import Input from "../Wolfie2D/Input/Input";
import GameNode from "../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import MathUtils from "../Wolfie2D/Utils/MathUtils";
import { PTL_Color } from "../ptl_color";
import { PTL_Events } from "../ptl_enums";
import PlatformController, { PlatformStates } from "./PlatformController";

export default abstract class PlatformState extends State {
	owner: GameNode;
	gravity: number = 500;
	parent: PlatformController;
	playerPos: Vec2;
	distanceToPlayer: number = 500;

	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);

		this.owner = owner;
	}

	handleInput(event: GameEvent): void {
		if (event.type == PTL_Events.SUIT_COLOR_CHANGE) {
			let new_color = event.data.get("color");
			if (this.parent.color == new_color){
				this.owner.disablePhysics();
			}
			else {
				this.owner.enablePhysics();
			}
		}
		if (event.type == PTL_Events.PLAYER_MOVE) {
			this.playerPos = event.data.get("position");
			this.distanceToPlayer = this.owner.position.distanceTo(this.playerPos);
		}
	}

		getInputXDirection(): number {
			let x = (Input.isPressed("left") ? -1 : 0) + (Input.isPressed("right") ? 1 : 0);
			return x;
		}

	update(deltaT: number): void {
		// Do gravity
		this.parent.velocity.y += this.gravity * deltaT;

		/*
		if (this.owner.onWall) {
			// Flip around
			this.parent.direction.x *= -1;
			(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner)
				.invertX;
		}

		if (this.owner.onCeiling || this.owner.onGround) {
			if (this.gravity != 0) {
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * this.parent.ySpeed);
			}
			else{
				this.parent.velocity.y =
					(Math.sign(-this.parent.velocity.y) * MathUtils.clamp(Math.abs(this.parent.velocity.y), 0, this.parent.ySpeed));
			}
		}
		*/
	}
}
