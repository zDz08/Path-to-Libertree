import GameNode from "../Wolfie2D/Nodes/GameNode";
import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import StateMachineAI from "../Wolfie2D/AI/StateMachineAI";
import { PTL_Events } from "../ptl_enums";
import GameEvent from "../Wolfie2D/Events/GameEvent";
import Input from "../Wolfie2D/Input/Input";
import { EaseFunctionType } from "../Wolfie2D/Utils/EaseFunctions";
import ShowHide from "./KeyIndicatorStates/ShowHide";

export enum KeyIndicatorStates {
	SHOW_HIDE = "ShowHide"
}

export default class KeyIndicatorController extends StateMachineAI {
    owner: GameNode;
    playerPos: Vec2 = new Vec2(0, 0);
    keyPos: Vec2;
    direction: Vec2;

    initializeAI(owner: GameNode, keyPos: Vec2) {
        this.owner = owner;
        this.keyPos = keyPos;

        this.receiver.subscribe(PTL_Events.PLAYER_MOVE);

        let showHide = new ShowHide(this, owner);
        this.addState(KeyIndicatorStates.SHOW_HIDE, showHide);
        this.initialize(KeyIndicatorStates.SHOW_HIDE);
    }

    changeState(stateName: string): void {
        super.changeState(stateName);
    }

    update(deltaT: number): void {
        super.update(deltaT);
        const posx = this.playerPos.x + 32;
        const posy = this.playerPos.y - 32;
        this.owner.position.set(posx, posy);

        let dx = this.keyPos.x - this.playerPos.x;
        let dy = this.keyPos.y - this.playerPos.y;
        let angle = Math.atan2(-(dy), dx) + Math.PI / 2;
        this.owner.rotation = angle;
    }

    handleEvent(event: GameEvent): void {
        super.handleEvent(event);
        if (event.type === PTL_Events.PLAYER_MOVE) {
            // Update player position
            this.playerPos = event.data.get("position");
        }
    }
}