import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import ButtonFactory from "../../UIElements/ButtonFactory";
import MainMenu from "./MainMenu";
import LabelFactory from "../../UIElements/LabelFactory";

export default class Controls extends Scene {

    animatedSprite: AnimatedSprite;

    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
    }

    startScene(): void {
        this.addUILayer("Controls");
        this.addLayer("Background", 0);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(10,10);
        bg.position.copy(this.viewport.getCenter());

        let headings = new LabelFactory("BlackChancery", 64);
        let text = new LabelFactory("CrimsonText", 32, 32+8);
        
        const controls = 
        `W - Jump
        A - Move Left
        D - Move Right
        Z - Select Platform 1
        X - Select Platform 2
        C - Select Platform 3
        Left-Click - Spawn Platform
        J - Select Green Suit Color
        K - Select Red Suit Color
        L - Select Blue Suit Color`;

        let controlsLabel = headings.makeLabel(this.add, "Controls", new Vec2(size.x, size.y-260), "Controls");
        let controlsText = text.makeParagraph(this.add, "Controls", new Vec2(size.x, size.y-190), controls.split('\n'));


        const buttonWidth = 227;
        const buttonHeight = 50;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create main buttons
        let returnBtn = buttonFactory.makeButton(this.add, "Controls", new Vec2(size.x, size.y+250), "Return");
        returnBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {});
        }
        
    }

    unloadScene(): void {

    }
}

