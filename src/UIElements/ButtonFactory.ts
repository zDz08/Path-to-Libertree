import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Button from "../Wolfie2D/Nodes/UIElements/Button";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import FactoryManager from "../Wolfie2D/Scene/Factories/FactoryManager";
import Color from "../Wolfie2D/Utils/Color";

export default class ButtonFactory {
    backgroundColor = new Color(94, 121, 60);
    borderColor = new Color(38, 70, 12);
    borderRadius = 15;
    width = 227;
    height = 60;
    font = "BlackChancery";
    fontSize = 30;

    constructor(width?: number, height?: number){
        this.width = width ?? 227;
        this.height = height ?? 60;
    }

    makeButton(factoryManager: FactoryManager, layer: string, position: Vec2, text: string){
        let btn = <Button>factoryManager.uiElement(UIElementType.BUTTON, layer, {position: position, text: text});
        btn.size.set(this.width, this.height);
        btn.backgroundColor = this.backgroundColor;
        btn.borderColor = this.borderColor;
        btn.borderRadius = this.borderRadius;
        btn.textColor = Color.WHITE;
        btn.font = this.font;
        btn.fontSize = this.fontSize;
        return btn;
    }

    makeDisabledButton(factoryManager: FactoryManager, layer: string, position: Vec2, text: string){
        let btn = <Button>factoryManager.uiElement(UIElementType.BUTTON, layer, {position: position, text: text});
        btn.size.set(this.width, this.height);
        btn.backgroundColor = new Color(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, .5);
        btn.textColor = new Color(255, 255, 255, .5)
        btn.borderColor = this.borderColor;
        btn.borderRadius = this.borderRadius;
        btn.font = this.font;
        btn.fontSize = this.fontSize;
        return btn;
    }
}