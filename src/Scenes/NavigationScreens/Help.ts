import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
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
        this.addUILayer("Help");
        this.addLayer("Background", 0);

        // Center the viewport
        let size = this.viewport.getHalfSize();
        this.viewport.setFocus(size);

        this.viewport.setZoomLevel(1);

        let bg = this.add.sprite("screenBg", "Background");
        bg.scale.set(10,10);
        bg.position.copy(this.viewport.getCenter());

        let headings = new LabelFactory("BlackChancery", 48);
        let text = new LabelFactory("CrimsonText", 24);
        
        const story = 
        `In the wintertime, Twinklefern, tree enthusiast and philanthropist, dresses up as a Christmas tree to
        perform for and give presents to the citizens of Christmassachussetts. Unfortunately for Twinklefern, he lives
        quite far, meaning he would have to trek many miles by foot. Luckily, he possesses magic platforms that 
        exhibit strange and varying behaviors to help him get there just in time to make a jolly entrance!`;

        const creators = "Developed by Elizabeth Sham, Thomas Traube, and Zhendong Zeng";

        const cheatCodes = 
        `I - Toggle Invincibility\n
        U - Unlimited Platforms\n
        O - Unlock All Levels`;

        let storyLabel = headings.makeLabel(this.add, "Help", new Vec2(size.x, size.y-300), "Story");
        let cheatCodesLabel = headings.makeLabel(this.add, "Help", new Vec2(size.x, size.y-80), "Cheat Codes");
        let creatorsLabel = headings.makeLabel(this.add, "Help", new Vec2(size.x, size.y+150), "Creators");

        let storyText = text.makeParagraph(this.add, "Help", new Vec2(size.x, size.y-250), story.split('\n'));
        let cheatCodesText = text.makeParagraph(this.add, "Help", new Vec2(size.x, size.y-30), cheatCodes.split('\n'));
        let creatorsText = text.makeLabel(this.add, "Help", new Vec2(size.x, size.y+200), creators);


        const buttonWidth = 227;
        const buttonHeight = 50;
        let buttonFactory = new ButtonFactory(buttonWidth, buttonHeight);
        // Create main buttons
        let returnBtn = buttonFactory.makeButton(this.add, "Help", new Vec2(size.x, size.y+270), "Return");
        returnBtn.onClick = () => {
            this.sceneManager.changeToScene(MainMenu, {});
        }

        // Scene has started, so start playing music
        this.emitter.fireEvent(GameEventType.PLAY_SOUND, {key: "menu", loop: true, holdReference: true});
    }

    unloadScene(): void {

    }
}

