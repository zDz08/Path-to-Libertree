import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PTL_PlatformType } from "../ptl_enums";
import { PlatformStates } from "./PlatformController";
import PlatformState from "./PlatformState";

export default class Crash extends PlatformState {
	protected delay: number;

	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("CRASH", true);
		this.delay = 2;
	}

	update(deltaT: number): void {
		super.update(deltaT);
		if(this.delay > 0) {
            this.delay -= deltaT;
        }else {
            this.parent.system.startSystem(2000, 1, this.owner.position.clone());
            this.owner.destroy();
            this.delay = 2;
        }
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}