import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import ButtonFactory from "../../UIElements/ButtonFactory";
import Levels from "./Levels";
import Help from "./Help";
import Controls from "./Controls";

export default class MainMenu extends Scene {

    animatedSprite: AnimatedSprite;

    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
    }

    startScene(): void {
        this.addUILayer("Main");
        this.addLayer("Background", 0);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(2,2);
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
            /*
                Init the next scene with physics collisions:

                          ground  player  balloon 
                ground    No      --      -- 
                player    Yes      No      --  
                balloon   Yes      No      No  

                Each layer becomes a number. In this case, 4 bits matter for each

                ground:  self - 000, collisions - 011
                player:  self - 001, collisions - 100
                balloon: self - 010, collisions - 000
            */

            let sceneOptions = {

            }
            // this.sceneManager.changeToScene(Level, {}, sceneOptions);
        }

        selectLvlBtn.onClick = () => {
            this.sceneManager.changeToScene(Levels, {});
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

