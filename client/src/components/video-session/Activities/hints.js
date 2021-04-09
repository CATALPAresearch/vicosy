import Instruction from "../../../components/Assistent/phases/Instruction";
export default class Hints {
    constructor() {
        this.instructions = [];
        this.instructions.push(new Instruction("Wenn du weitere Fragen hast, schau dir die FAQ im Navigationsmenü rechts oben an.", "faq"));
        this.instructions.push(new Instruction("Du erhältst Erklärungen der Schaltflächen, indem du mit der Maus über sie fährst.", ""));
        this.instructions.push(new Instruction("Informiere deinen Partner, wenn du eine Pause machst.", ""));
        this.instructions.push(new Instruction("Wenn du nicht mehr weiterweißt, kommuniziere mit deinem Parnter.", ""));
        this.instructions.push(new Instruction("Wusstest du schon? Du kannst mit deinem Partner chatten.", "chat-write"));        
        this.instructions.push(new Instruction("Wusstest du schon? Du kannst mit deinem Partner eine Videokonferenz abhalten.", "video-button"));      
        this.instructions.push(new Instruction("Wusstest du schon? Du kannst mit deinem Partner über Audio sprechen.", "audio-button"));      
         
    }
}