export default class AbstractPhase {
    constructor() {
        this.pointer = 0;
        this.instructions = [];
        this.name="";
    }
// returns the actual chosen instruction
    getActInstruction() {
        if (!this.instructions)
            return "";
        else
            return this.instructions[this.pointer];
    }

    
    hasNext() {
        if (this.instructions[this.pointer + 1])
            return true;
        else
            return false;
    }

    hasPrevious() {
        if (!this.pointer)
            return false;
        else
            if (this.pointer === 0)
                return false;
            else
                return true;
    }
    next() {
        this.pointer++;
    }
    previous() {
        this.pointer--;
    }
}