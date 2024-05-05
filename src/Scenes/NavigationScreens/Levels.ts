import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Input from "../../Wolfie2D/Input/Input";
import ButtonFactory from "../../UIElements/ButtonFactory";
import MainMenu from "./MainMenu";
import Level1 from "../GameLevels/Level1";
import Level4 from "../GameLevels/Level4";
import Level5 from "../GameLevels/Level5";
import Level2 from "../GameLevels/Level2";
import GameLevel from "../GameLevels/GameLevel";
import Level3 from "../GameLevels/Level3";

export default class Levels extends Scene {

    animatedSprite: AnimatedSprite;
    protected size = this.viewport.getHalfSize();
    protected buttonWidth = 227;
    protected buttonHeight = 50;
    protected buttonsPadding = 20;
    protected xspacing = this.buttonWidth/2 + this.buttonsPadding;
    protected yspacing = this.buttonHeight + 50;
    buttonFactory: ButtonFactory = new ButtonFactory(this.buttonWidth, this.buttonHeight);
    level1: Button;
    level2: Button;
    level3: Button;
    level4: Button;
    level5: Button;
    level6: Button;
    passedLevels: number[];
    

    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
    }

    
    initScene(init: Record<string, any>): void {
        this.passedLevels = init.passedLevels;
    }

    startScene(): void {
        this.addUILayer("Levels");
        this.addLayer("Background", 0);

        // Center the viewport
        this.viewport.setFocus(this.size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(10,10);
        bg.position.copy(this.viewport.getCenter());

        let levelsLabel = <Label>this.add.uiElement(UIElementType.LABEL, "Levels", {position: new Vec2(this.size.x, this.size.y-190), text: "Levels"});
        levelsLabel.textColor = Color.WHITE;
        levelsLabel.fontSize = 64;
        levelsLabel.font = "BlackChancery";
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
        const gameLevels = [
            ()=> {this.sceneManager.changeToScene(Level1, {}, sceneOptions);},
            ()=> {this.sceneManager.changeToScene(Level2, {}, sceneOptions);},
            ()=> {this.sceneManager.changeToScene(Level3, {}, sceneOptions);},
            ()=> {this.sceneManager.changeToScene(Level4, {}, sceneOptions);},
            ()=> {this.sceneManager.changeToScene(Level5, {}, sceneOptions);},
            ()=> {this.sceneManager.changeToScene(Level1, {}, sceneOptions);}
        ]
        if (this.passedLevels[0]){
            this.level1 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y-this.yspacing), "One");
            this.level1.onClick = gameLevels[0]
        } else {
            this.level1 = this.buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y-this.yspacing), "One");
        }
        if (this.passedLevels[1]) {
            this.level2 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y-this.yspacing), "Two");
            this.level2.onClick = gameLevels[1]
        }else {
            this.level2 = this.buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y-this.yspacing), "Two");
        }
        if (this.passedLevels[2]){
            this.level3 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y), "Three");
            this.level3.onClick = gameLevels[1]
        }else {
            this.level3 = this.buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y), "Three");
        }
        if (this.passedLevels[3]) {
            this.level4 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y), "Four");
            this.level4.onClick = gameLevels[1]
        }else {
            this.level4 = this.buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y), "Four");
        }
        if (this.passedLevels[4]){
            this.level5 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y+this.yspacing), "Five");
            this.level5.onClick = gameLevels[1]
        }else {
            this.level5 = this.buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y+this.yspacing), "Five");
        }
        if (this.passedLevels[5]) {
            this.level6 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y+this.yspacing), "Six");
            this.level6.onClick = gameLevels[1]
        }else {
            this.level6 = this.buttonFactory.makeDisabledButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y+this.yspacing), "Six");
        }
        let returnBtn = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x, this.size.y+190), "Return");
        returnBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {passedLevels: this.passedLevels});
        }
        Input.enableInput();
    }

    updateScene(deltaT: number) {
        if (Input.isKeyJustPressed("o")) {
            this.level2 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y-this.yspacing), "Two");
            this.level3 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y), "Three");
            this.level4 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x+this.xspacing, this.size.y), "Four");
            this.level5 = this.buttonFactory.makeButton(this.add, "Levels", new Vec2(this.size.x-this.xspacing, this.size.y+this.yspacing), "Five");
        }
        if(!this.level2.frozen) {
            this.level2.onClick = () => {
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
                Input.disableInput();
                this.sceneManager.changeToScene(Level2, {}, sceneOptions);
            }
        }
        if(!this.level3.frozen) {
            this.level3.onClick = () => {
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
                Input.disableInput();
                this.sceneManager.changeToScene(Level3, {}, sceneOptions);
            }
        }
        if(!this.level4.frozen) {
            this.level4.onClick = () => {
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
                Input.disableInput();
                this.sceneManager.changeToScene(Level4, {}, sceneOptions);
            }
        }
        if(!this.level5.frozen) {
            this.level5.onClick = () => {
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
                Input.disableInput();
                this.sceneManager.changeToScene(Level5, {}, sceneOptions);
            }
        }
    }

    unloadScene(): void {
    }

}

