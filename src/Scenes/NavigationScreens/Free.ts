import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import ButtonFactory from "../../UIElements/ButtonFactory";
import MainMenu from "./MainMenu";
import LabelFactory from "../../UIElements/LabelFactory";

export default class Free extends Scene {

    animatedSprite: AnimatedSprite;

    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
        this.load.image("free_tree", "assets/sprites/free_tree.png");

    }

    startScene(): void {
        this.addUILayer("Free");
        this.addLayer("Background", 0);
        this.addLayer("Icon", 1);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(2,2);
        bg.position.copy(this.viewport.getCenter());

        let headings = new LabelFactory("BlackChancery", 64);

        let controlsLabel = headings.makeLabel(this.add, "Free", new Vec2(size.x, size.y-210), "You Are Free!");

        let free_tree = this.add.sprite("free_tree", "Icon");
        free_tree.scale.set(1,1);
        free_tree.position.copy(new Vec2(size.x, size.y));

        const buttonWidth = 320;
        const buttonHeight = 50;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create main buttons
        let mainMenuBtn = buttonFactory.makeButton(this.add, "Free", new Vec2(size.x, size.y+210), "Back to Main Menu");

        mainMenuBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {});
        }
        
    }

    unloadScene(): void {

    }
}

