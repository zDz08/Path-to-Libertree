import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import AnimatedSprite from "../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import { PTL_Events } from "../ptl_enums";
import PlatformState from "./PlatformState";

export default class ZeroGravity extends PlatformState {
	directionToPlayer: Vec2;
	timer: number = 0;

	onEnter(): void {
		this.gravity = 0;
		
		(<AnimatedSprite>this.owner).animation.play("IDLE", true);
	}

	update(deltaT: number): void {
		super.update(deltaT);

		if(this.owner.onWall || this.owner.onCeiling || this.owner.onGround) {
			this.timer = 0.5;
			this.parent.velocity.x = this.parent.direction.x * this.parent.speed;
		}else if(this.timer > 0) {
			this.timer -= deltaT;
		}

		if(this.timer <= 0) {
			if(this.distanceToPlayer < 320) {
				this.directionToPlayer = new Vec2(
					this.playerPos.x - this.owner.position.x,
					this.playerPos.y - this.owner.position.y
				).normalize();
				this.parent.velocity = this.directionToPlayer.scale(this.parent.speed);
				this.parent.velocity.x *= 2;
			}else if(this.distanceToPlayer >= 320 && this.parent.velocity.x !== 0) {
				this.parent.velocity.x = this.parent.direction.x * this.parent.speed;
			}
		}
		this.owner.move(this.parent.velocity.scaled(deltaT));

	}

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}