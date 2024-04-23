import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import EnemyController from "../EnemyController";

export default class WalkOpposite extends State {
    owner: GameNode;
	parent: EnemyController;
    tilemap: OrthogonalTilemap;


	constructor(parent: StateMachine, owner: GameNode, options: Record<string, any>) {
		super(parent);
		this.owner = owner;
        this.tilemap = this.owner.getScene().getTilemap(options.tilemap) as OrthogonalTilemap;
	}
    
	onEnter(): void {
		(<AnimatedSprite>this.owner).animation.play("FLYING_LEFT", true);
	}

	update(deltaT: number): void {
        // if enemy hits a wall        
		if (this.owner.onWall) {
			// Flip around
			this.parent.direction.x *= -1;
			(<AnimatedSprite>this.owner).invertX = !(<AnimatedSprite>this.owner)
				.invertX;
		}

        const belowTile = this.tilemap.getColRowAt(this.owner.position);
        belowTile.y += 1;
        belowTile.x += this.parent.direction.normalized().x;
        const tile = this.tilemap.getTileAtRowCol(belowTile);
        // checking if the next tile under the enemy is not a platform
        if (tile != 4) {
            this.parent.direction.x *= -1;
            this.parent.velocity = this.parent.velocity.mult(this.parent.direction);
            // the enemy is moving left, but the label is wrong online so i put flying_right
            if (this.parent.direction.x < 0) {
                (<AnimatedSprite>this.owner).animation.play("FLYING_RIGHT", true);
            }
            // vice versa previous comment
            if (this.parent.direction.x > 0) {
                (<AnimatedSprite>this.owner).animation.play("FLYING_LEFT", true);
            }
        } 
        // for some reason, using .move() freezes the enemy
        this.owner.positionX = this.owner.position.x + this.parent.direction.x;
	}

    handleInput(event: GameEvent): void {
    }

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.stop();
		return {};
	}
}