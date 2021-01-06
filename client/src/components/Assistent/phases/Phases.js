import React, { Component } from "react";
import AbstractPhase from "./AbstractPhase";
import Instruction from "./Instruction";
export class GetTogether extends AbstractPhase {
    constructor() {
        super();
        this.name = "GETTOGETHER";
        this.instructions.push(new Instruction("Warte auf deinen Partner!", ""));
    }

}

export function Options(orientation, mode, id, top, left) {
    this.orientation = orientation;
    this.mode = mode;
    this.id = id;
    this.top = top;
    this.left = left;
}
export class WarmUp extends AbstractPhase {
    constructor() {
        super();
        this.name = "WARMUP";
        this.instructions.push(new Instruction("Stell dich deinem Partner vor!", ""));
        this.instructions.push(new Instruction("Du kannst den Chat dafür nutzen!", new Array(new Options("right", "id", "chat-write", 10, 0))));
        this.instructions.push(new Instruction("Oder eine Videoübertragung starten!", new Array(new Options("right", "id", "video-button", 0, 0))));
        this.instructions.push(new Instruction("Oder über Audio kommunizieren!", new Array(new Options("right", "id", "audio-button", 0, 0))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));


    }
}
export class SeparateSectionsTutor extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTOR";
        this.instructions.push(new Instruction("Nun sollt ihr das Video erst einmal in Unterabschnitte unterteilen", ""));
        this.instructions.push(new Instruction("Die Anzahl der Abschnitte sollte ein Vielfaches der Gruppenmitglieder sein.", ""));
        this.instructions.push(new Instruction("Für eine Zweiergruppe also 2, 4, 6, ... Abschnitte", ""));
        this.instructions.push(new Instruction("Nur du kannst die Einteilung vornehmen, kommuniziert deshalb miteinander.", ""));
        this.instructions.push(new Instruction("Starte hiermit das Video.", new Array(new Options("left", "id", "play-button", 40, 100))));
        this.instructions.push(new Instruction("Synch bedeutet: Ihr schaut gleichzeitig. ", new Array(new Options("right", "id", "sync-mode", 0, -60))));
        this.instructions.push(new Instruction("Hier kannst du eine Unterteilung vornehmen. Wähle über den kleinen Pfeil links 'Chapter annotation'.", new Array(new Options("right", "id", "open-annotations", 10, -30))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));



    }
}
export class SeparateSectionsTutee extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTEE";
        this.instructions.push(new Instruction("Nun sollt ihr das Video erst einmal in Unterabschnitte unterteilen", ""));
        this.instructions.push(new Instruction("Die Anzahl der Abschnitte sollte ein Vielfaches der Gruppenmitglieder sein.", ""));
        this.instructions.push(new Instruction("Für eine Zweiergruppe also 2, 4, 6, ... Abschnitte", ""));
        this.instructions.push(new Instruction("Nur dein Partner kann die Einteilung vornehmen, kommuniziert deshalb miteinander.", ""));
        this.instructions.push(new Instruction("Das Video kannst du allerdings auch starten.", new Array(new Options("left", "id", "play-button", 20, 100))));
        this.instructions.push(new Instruction("Synch bedeutet: Ihr schaut gleichzeitig. ", new Array(new Options("right", "id", "sync-mode", 20, -60))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));



    }
}