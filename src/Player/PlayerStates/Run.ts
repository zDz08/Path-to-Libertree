import Input from "../../Wolfie2D/Input/Input";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PTL_Color } from "../../ptl_color";
import { PTL_Events } from "../../ptl_enums";
import { PlayerStates } from "../PlayerController";
import OnGround from "./OnGround";

export default class Run extends OnGround {
	owner: AnimatedSprite;

	onEnter(options: Record<string, any>): void {
		this.parent.speed = this.parent.MAX_SPEED;
	}

	updateSuit() {
		if (this.parent.suitColor == PTL_Color.RED){ 
			this.owner.animation.playIfNotAlready("RED_WALK", true);
		}
		else if (this.parent.suitColor == PTL_Color.GREEN){
			this.owner.animation.playIfNotAlready("GREEN_WALK", true);
		}
		else if (this.parent.suitColor == PTL_Color.BLUE){
			this.owner.animation.playIfNotAlready("BLUE_WALK", true);
		}
	}

	update(deltaT: number): void {
		super.update(deltaT);

		let dir = this.getInputDirection();

		if(dir.isZero()){
			this.finished(PlayerStates.IDLE);
		} else {
			if(!Input.isPressed("run")){
				this.finished(PlayerStates.WALK);
			}
		}

		this.parent.velocity.x = dir.x * this.parent.speed

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		this.owner.animation.stop();
		return {};
	}
}