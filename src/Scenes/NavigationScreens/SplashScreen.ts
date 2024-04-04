import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import ButtonFactory from "./ButtonFactory";
import MainMenu from "./MainMenu";

export default class SplashScreen extends Scene {

    animatedSprite: AnimatedSprite;

    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
        this.load.image("logo", "assets/sprites/tree_door_key.png");
    }
    

    startScene(): void {
        this.addUILayer("SplashScreen");
        this.addLayer("Background", 0);
        this.addLayer("Logo", 1);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(2,2);
        bg.position.copy(this.viewport.getCenter());

        let logo = this.add.sprite("logo", "Logo");
        logo.scale.set(1,1);
        logo.position.copy(new Vec2(size.x, size.y-80));
        
        let gameName = <Label>this.add.uiElement(UIElementType.LABEL, "SplashScreen", {position: new Vec2(size.x, size.y+105), text: "Path to Libertree"});
        gameName.font = "BlackChancery";
        gameName.textColor = Color.WHITE;
        gameName.fontSize = 67;
        const buttonWidth = 227;
        const buttonHeight = 50;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create start button
        let startBtn = buttonFactory.makeButton(this.add, "SplashScreen", new Vec2(size.x, size.y+175), "Begin Journey");
        startBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {});
        }
        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        this.resourceManager.keepImage("screenBg");
        this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "menu"});
    }
}

