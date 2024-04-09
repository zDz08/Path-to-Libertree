import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import AnimatedSprite from "../../Wolfie2D/Nodes/Sprites/AnimatedSprite";
import Scene from "../../Wolfie2D/Scene/Scene";
import ButtonFactory from "../../UIElements/ButtonFactory";
import MainMenu from "./MainMenu";
import LabelFactory from "../../UIElements/LabelFactory";
import GameLevel from "../GameLevels/GameLevel";

export default class Dead extends Scene {

    animatedSprite: AnimatedSprite;
    protected failedLevel: new (...args: any) => GameLevel;
    
    loadScene(): void {
        this.load.image("screenBg", "assets/sprites/screenBackground.png");
        this.load.image("dead_tree", "assets/sprites/dead_tree.png");

    }

    initScene(init: Record<string, any>): void {
        this.failedLevel = init.failedLevel;
    }

    startScene(): void {
        this.addUILayer("Dead");
        this.addLayer("Background", 1);
        this.addLayer("Icon", 0);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(10,10);
        bg.position.copy(this.viewport.getCenter());

        let headings = new LabelFactory("BlackChancery", 64);

        let deadLabel = headings.makeLabel(this.add, "Dead", new Vec2(size.x, size.y-160), "You Are Dead");

        let dead_tree = this.add.sprite("dead_tree", "Dead");
        dead_tree.scale.set(1,1);
        dead_tree.position.copy(new Vec2(size.x, size.y-64));

        const buttonWidth = 320;
        const buttonHeight = 50;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create main buttons
        let restartBtn = buttonFactory.makeButton(this.add, "Dead", new Vec2(size.x, size.y+90), "Restart");
        let mainMenuBtn = buttonFactory.makeButton(this.add, "Dead", new Vec2(size.x, size.y+160), "Back to Main Menu");

        mainMenuBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {});
        }
        
        restartBtn.onClick = () => {
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
            console.log(this.failedLevel);
            this.sceneManager.changeToScene(this.failedLevel, {}, sceneOptions)
        }
    }

    unloadScene(): void {

    }
}

