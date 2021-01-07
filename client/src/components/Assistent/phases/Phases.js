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
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 20))));

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

export class Prepare extends AbstractPhase {
    constructor() {
        super();
        this.name = "PREPARE";
        this.instructions.push(new Instruction("Nun musst du deine Abschnitte so vorbereiten, dass du sie deinem Partner vorstellen kannst.", ""));
        this.instructions.push(new Instruction("Wie du siehst, kann jeder das Video nun separat anschauen.", new Array(new Options("right", "id", "sync-mode", 15, 0))));
        this.instructions.push(new Instruction("Hier beginnt dein Abschnitt.", new Array(new Options("right", "id", "asynch-timeline-handle", 15, 0))));
        this.instructions.push(new Instruction("Mache dir hier Notizen ", new Array(new Options("right", "id", "notes-tab", 15, 0))));
        this.instructions.push(new Instruction("Möchtest du in deinem Vortrag Bilder aus dem Video zeigen, kannst du diese über 'Annotate/Annotation' speichern.", new Array(new Options("right", "id", "open-annotations", 10, -30))));
        this.instructions.push(new Instruction("Über diesen Tab kannst du später darauf zugreifen", new Array(new Options("right", "id", "annotations-tab", 10, -30))));
        this.instructions.push(new Instruction("Bereite einen Vortrag für alle deine Abschnitte vor", ""));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));
    }


}



export class PresentTutor extends AbstractPhase {
    constructor() {
        super();
        this.name = "PRESENTTUTOR";
        this.instructions.push(new Instruction("Stelle deinem Partner die Inhalte deiner Abschnitte vor.", ""));
        this.instructions.push(new Instruction("Du kannst auch im Video zeichnen", new Array(new Options("right", "id", "VideoCanvas", 10, -30))));
        this.instructions.push(new Instruction("Hier findest du die gespeicherten Stellen des Videos", new Array(new Options("right", "id", "annotations-tab", 10, -30))));
        this.instructions.push(new Instruction("Hier gibt es verschiedene Methoden des Zeichnens", new Array(new Options("right", "id", "maker-tab", 10, -30))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));
    }



}


export class PresentTutee extends AbstractPhase {
    constructor() {
        super();
        this.name = "PRESENTTUTEE";
        this.instructions.push(new Instruction("Höre nun dem Vortrag deines Partners zu.", ""));
        this.instructions.push(new Instruction("Stelle bei Bedarf Rückfragen.", ""));
        this.instructions.push(new Instruction("Mache dir hier Notizen ", new Array(new Options("right", "id", "notes-tab", 15, 0))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));
    }


}

export class DeepenTutor extends AbstractPhase {
    constructor() {
        super();
        this.name = "DEEPENTUTOR";
        this.instructions.push(new Instruction("Unterstütze deinen Partner bei seinem Vortrag", ""));
        this.instructions.push(new Instruction("Antworte auf Fragen deines Partners und korrigiere wenn nötig.", ""));

    }
}

export class DeepenTutuee extends AbstractPhase {
    constructor() {
        super();
        this.name = "DEEPENTUTEE";
        this.instructions.push(new Instruction("Fasse nun im gemeinsamem Dokument zusammen, was dir präsentiert wurde.", new Array(new Options("right", "id", "doc-tab", 15, 0))));
        this.instructions.push(new Instruction("Stelle bei Zweifeln Rückfragen an deinen Partner.", ""));
    }
}

export class Reflexion extends AbstractPhase {
    constructor() {
        super();
        this.name = "REFLEXION";
        this.instructions.push(new Instruction("Vertieft euer Wissen gemeinsam.", ""));
        this.instructions.push(new Instruction("Nutzt dafür alle Methoden, die ihr kennengelernt habt.", ""));
    }
}