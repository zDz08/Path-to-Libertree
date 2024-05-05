import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import ButtonFactory from "../../UIElements/ButtonFactory";
import Levels from "./Levels";
import Help from "./Help";
import Controls from "./Controls";
import Level1 from "../GameLevels/Level1";
import GameLevel from "../GameLevels/GameLevel";

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;
    passedLevels: number[];

    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
    }

    initScene(init: Record<string, any>): void {
        if (init.passedLevels != null){
            this.passedLevels = init.passedLevels;
        } else {
            this.passedLevels = [1];
        }
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("Background", 0);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(10,10);
        bg.position.copy(this.viewport.getCenter());

        const buttonWidth = 227;
        const buttonHeight = 50;
        const buttonsPadding = 27;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create main buttons
        let playBtn = buttonFactory.makeButton(this.add, "Main", new Vec2(size.x, size.y - buttonHeight - buttonHeight/2 - buttonsPadding - buttonsPadding/2), "Play Game");
        let selectLvlBtn = buttonFactory.makeButton(this.add, "Main", new Vec2(size.x, size.y - buttonHeight/2 - buttonsPadding/2), "Select Level");
        let helpBtn = buttonFactory.makeButton(this.add, "Main", new Vec2(size.x, size.y + buttonHeight/2 + buttonsPadding/2), "Help");
        let controlsBtn = buttonFactory.makeButton(this.add, "Main", new Vec2(size.x, size.y + buttonHeight + buttonHeight/2 + buttonsPadding + buttonsPadding/2), "Controls");
    
        // When the play button is clicked, go to the next scene
        playBtn.onClick = () => {
            let sceneOptions = {
                physics: {
                    groupNames: ["ground", "player", "platform"],
                    collisions:
                    [
                        [0, 1, 1],
                        [1, 0, 1],
                        [1, 1, 0]
                    ]
                }
            }
            this.sceneManager.changeToScene(Level1, {}, sceneOptions);
        }

        selectLvlBtn.onClick = () => {
            console.log(this.passedLevels);
            this.sceneManager.changeToScene(Levels, {passedLevels: this.passedLevels});
        }

        helpBtn.onClick = () => {
            this.sceneManager.changeToScene(Help, {});
        }
        
        controlsBtn.onClick = () => {
            this.sceneManager.changeToScene(Controls, {});
        }
        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}

