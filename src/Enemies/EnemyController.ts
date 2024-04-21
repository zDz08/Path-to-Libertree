import GameNode from "../Wolfie2D/Nodes/GameNode";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../Wolfie2D/AI/StateMachineAI";
import { PTL_Events } from "../ptl_enums";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import WalkOpposite from "./EnemyStates/WalkOpposite";
import KillPlayer from "./EnemyStates/KillPlayer";
import Input from "../Wolfie2D/Input/Input";


export enum EnemyStates {
	WALK_OPPOSITE = "WALK_OPPOSITE",
	KILL_PLAYER = "kill_player"
}

export default class EnemyController extends StateMachineAI {
	owner: GameNode;
	direction: Vec2 = new Vec2(-1, 0);
	velocity: Vec2 = new Vec2(10, 0);
    playerPos: Vec2;

	initializeAI(owner: GameNode, options: Record<string, any>){
		this.owner = owner;
        // this.owner.enablePhysics();
		this.receiver.subscribe(PTL_Events.PLAYER_MOVE);
        this.receiver.subscribe(PTL_Events.PLAYER_KILLED);

        let back_and_forth = new WalkOpposite(this, owner, options);
		this.addState(EnemyStates.WALK_OPPOSITE, back_and_forth);
		let kill_player = new KillPlayer(this, owner);
		this.addState(EnemyStates.KILL_PLAYER, kill_player);

        this.initialize(EnemyStates.WALK_OPPOSITE);
	}

	changeState(stateName: string): void {
        super.changeState(stateName);
	}

	update(deltaT: number): void {
		super.update(deltaT);
	}

    
	handleEvent(event: GameEvent): void {
        super.handleEvent(event);
		if (event.type == PTL_Events.PLAYER_MOVE) {
			this.playerPos = event.data.get("position");
            if (Math.abs(this.playerPos.x - this.owner.position.x) < 30 && 
                Math.abs(this.playerPos.y - this.owner.position.y) < 30) {
                    this.changeState(EnemyStates.KILL_PLAYER);
                    Input.disableInput();
                    this.emitter.fireEvent(PTL_Events.PLAYER_KILLED);
            }
        }
	}
}