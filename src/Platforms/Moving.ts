import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import PlatformState from "./PlatformState";

export default class Moving extends PlatformState {
	
	onEnter(): void {
        this.gravity = 0;

		(<AnimatedSprite>this.owner).animation.play("IDLE", true);

		this.parent.velocity.x = this.parent.direction.x * this.parent.speed;
	}

	update(deltaT: number): void {
		super.update(deltaT);

		
		if (Math.abs(this.parent.velocity.x) > 20) {
			this.parent.velocity.x *= 0.99;
		}else {
			this.parent.direction.x *= -1;
			this.parent.velocity.x = this.parent.direction.x * this.parent.speed;
		}

		this.parent.velocity.y = 0;

		this.owner.move(this.parent.velocity.scaled(deltaT));
	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}