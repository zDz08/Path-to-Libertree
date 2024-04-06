import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlatformState from "./PlatformState";

export default class Rigid extends PlatformState {
	
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}