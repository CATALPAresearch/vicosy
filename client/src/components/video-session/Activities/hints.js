export default class Hints {
    constructor() {
        this.instructions = [];
        this.instructions.push(new Instruction("Wenn du weitere Fragen hast, schau dir die FAQ im Navigationsmenü rechts oben an.", "faq"));
        this.instructions.push(new Instruction("Du erhälst Erklärungen der Elemente der Benutzeroberfläche, wenn du mit der Maus über sie fährst.", ""));
        this.instructions.push(new Instruction("Informiere deinen Partner, wenn du eine Pause machst.", ""));
       

    }
}