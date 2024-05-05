import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import StateMachine from "../../Wolfie2D/DataTypes/State/StateMachine";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import State from "../../Wolfie2D/DataTypes/State/State";
import KeyIndicatorController from "../KeyIndicatorController";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import GameEvent from "../../Wolfie2D/Events/GameEvent";

export default class ShowHide extends State {

    handleInput(event: GameEvent): void {
    }

    owner: GameNode;
    parent: KeyIndicatorController;

    constructor(parent: StateMachine, owner: GameNode) {
		super(parent);
		this.owner = owner;
	}
    
    onEnter(): void {
        // Determine if the key indicator is within the viewport
        const isInViewport = this.isInViewport();

        if (isInViewport) {
            // Show the key indicator
            this.owner.alpha = 0;
        } else {
            // Hide the key indicator
            this.owner.alpha = 1;
        }
    }

    update(deltaT: number): void {
        const isInViewport = this.isInViewport();

        if (isInViewport) {
            // Show the key indicator
            this.owner.alpha = 0;
        } else {
            // Hide the key indicator
            this.owner.alpha = 1;
        }
    }

    onExit(): Record<string, any> {
        return {};
    }

    isInViewport(): boolean {
        const xSize = 450;
        const ySize = 250;
        let distX = Math.abs(this.parent.playerPos.x - this.parent.keyPos.x);
        let distY = Math.abs(this.parent.keyPos.y - this.parent.playerPos.y);
        // Check if the key indicator's position is within the viewport bounds
        return distX < xSize && distY < ySize;
    }
}