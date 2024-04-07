import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PTL_PlatformType } from "../ptl_enums";
import { PlatformStates } from "./PlatformController";
import PlatformState from "./PlatformState";

export default class Rigid extends PlatformState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if(this.parent.type == PTL_PlatformType.MOVING) {
			this.finished(PlatformStates.MOVING);
		}
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}