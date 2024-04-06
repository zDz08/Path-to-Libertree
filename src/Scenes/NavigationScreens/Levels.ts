import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import ButtonFactory from "../../UIElements/ButtonFactory";
import MainMenu from "./MainMenu";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Level1 from "../GameLevels/Level1";

export default class Levels extends Scene {

    animatedSprite: AnimatedSprite;

    loadScene(): void {
        // this.load.image("screenBg", "assets/sprites/screenBackground.png");
    }

    startScene(): void {
        this.addUILayer("Levels");
        this.addLayer("Background", 0);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        // let bg = this.add.sprite("screenBg", "Background");
        // bg.scale.set(2,2);
        // bg.position.copy(this.viewport.getCenter());

        let levelsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "Levels", {position: new Vec2(size.x, size.y-180), text: "Levels"});
        levelsLabel.textColor = Color.WHITE;
        levelsLabel.fontSize = 64;
        levelsLabel.font = "BlackChancery";
        
        const buttonWidth = 227;
        const buttonHeight = 50;
        const buttonsPadding = 20;
        const xspacing = buttonWidth/2 + buttonsPadding;
        const yspacing = buttonHeight + 50;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create main buttons
        let level1 = buttonFactory.makeButton(this.add, "Levels", new Vec2(size.x-xspacing, size.y-yspacing), "One");
        let level2 = buttonFactory.makeButton(this.add, "Levels", new Vec2(size.x+xspacing, size.y-yspacing), "Two");
        let level3 = buttonFactory.makeButton(this.add, "Levels", new Vec2(size.x-xspacing, size.y), "Three");
        let level4 = buttonFactory.makeButton(this.add, "Levels", new Vec2(size.x+xspacing, size.y), "Four");
        let level5 = buttonFactory.makeButton(this.add, "Levels", new Vec2(size.x-xspacing, size.y+yspacing), "Five");
        let level6 = buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(size.x+xspacing, size.y+yspacing), "Six");
        let returnBtn = buttonFactory.makeButton(this.add, "Levels", new Vec2(size.x, size.y+180), "Return");
        returnBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {});
        }

        level1.onClick = () => {

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
    }

    unloadScene(): void {
    }

}

