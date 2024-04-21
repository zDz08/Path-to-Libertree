import State from "../../Wolfie2D/DataTypes/State/State";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { PTL_Events } from "../../ptl_enums";
import EnemyController from "../EnemyController";

export default class KillPlayer extends State {
    owner: GameNode;
	parent: EnemyController;


	constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}
    
	onEnter(): void {
        // the enemy is moving left, but the label is wrong online so i put flying_right
        if (this.parent.direction.x < 0) {
            (<AnimatedSprite>this.owner).animation.play("ATTACK_RIGHT", true);
        }
        // vice versa previous comment
        else if (this.parent.direction.x > 0) {
            (<AnimatedSprite>this.owner).animation.play("ATTACK_LEFT", true);
        }
		else {
            (<AnimatedSprite>this.owner).animation.play("IDLE", true);
        }
	}

	update(deltaT: number): void {
	}

    handleInput(event: GameEvent): void {
        if (event.type == PTL_Events.PLAYER_KILLED) {
            (<AnimatedSprite>this.owner).animation.play("DANCING", true);
        }
    }

	onExit(): Record<string, any> {
		(<AnimatedSprite>this.owner).animation.play("DANCING", true);
		return {};
	}
}