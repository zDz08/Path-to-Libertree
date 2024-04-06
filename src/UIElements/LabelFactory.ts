import Vec2 from "../Wolfie2D/DataTypes/Vec2";
import Label from "../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../Wolfie2D/Nodes/UIElements/UIElementTypes";
import FactoryManager from "../Wolfie2D/Scene/Factories/FactoryManager";
import Color from "../Wolfie2D/Utils/Color";

export default class LabelFactory {
    textColor = Color.WHITE;
    fontSize = 64;
    font = "BlackChancery";
    padding = 32;

    constructor(font?: string, fontSize?: number, padding?: number){
        this.font = font ?? "BlackChancery";
        this.fontSize = fontSize ?? 64;
        this.padding = padding ?? this.fontSize;
    }

    makeLabel(factoryManager: FactoryManager, layer: string, position: Vec2, text: string){
        let lbl = <Label>factoryManager.uiElement(UIElementType.LABEL, layer, {position: position, text: text});
        lbl.textColor = Color.WHITE;
        lbl.font = this.font;
        lbl.fontSize = this.fontSize;
        return lbl;
    }

    makeParagraph(factoryManager: FactoryManager, layer: string, startPos: Vec2, lines: string[]){
        let labelArr : Label[] = [];
        lines.forEach((line, index) => {
            console.log(line);
            console.log(startPos.y+index*this.padding);
            labelArr = [...labelArr, this.makeLabel(factoryManager, layer, new Vec2(startPos.x, startPos.y+index*this.padding), line.trim())];
        })
        return labelArr; 
    }
}