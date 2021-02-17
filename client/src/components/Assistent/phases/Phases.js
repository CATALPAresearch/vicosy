import React, { Component } from "react";
import AbstractPhase from "./AbstractPhase";
import Instruction from "./Instruction";
import Options from "./Options";
import {STUDENTLOBBY} from "./types";


export class NoPhase extends AbstractPhase {
    constructor() {
        super();
        this.url = window.location.href;
        this.name = "NOPHASE";
        this.instructions.push(new Instruction("Ich habe dir im Moment nichts zu sagen.", ""));


    }

}


export class GetTogether extends AbstractPhase {
    constructor() {
        super();
        this.url = window.location.href;
        this.name = "GETTOGETHER";
        this.instructions.push(new Instruction("Warte auf deinen Partner oder lade ihn über diese URL ein: " + this.url , ""));


    }

}



export class StudentLobby extends AbstractPhase {
    constructor() {
        super();
        this.name = STUDENTLOBBY;
        this.instructions.push(new Instruction("Willkommmen in der Lobby für das kollaborative Arbeiten mit Videos in Partnerarbeit.", ""));
        this.instructions.push(new Instruction("Ich bin dein Assistent und werde dich durch die Sitzung leiten.", ""));

        this.instructions.push(new Instruction("Unten siehst du die Videosessions, die dir zur Verfügung stehen.", ""));
        
                this.instructions.push(new Instruction("Um eine Sitzung durchzuführen, müssen beide Partner gleichzeitig die Sitzung starten.", ""));
        this.instructions.push(new Instruction("Starte mit den grünen Buttons eine Sitzung ", new Array(new Options("right", "id", "join-session", 20, 0))));
        
    }
}


export class WarmUp extends AbstractPhase {
    constructor(assignment) {
        super();
        this.name = "WARMUP";
        if (assignment) {
            this.instructions.push(new Instruction(assignment, ""));
            this.instructions.push(new Instruction("Kommuniziere mit deinem Partner.", ""));
        }
        else
            this.instructions.push(new Instruction("Stell dich deinem Partner vor!", ""));
        this.instructions.push(new Instruction("Du kannst den Chat dafür nutzen! ", new Array(new Options("right", "id", "chat-write", 10, 0))));
        this.instructions.push(new Instruction("Oder eine Videoübertragung starten!", new Array(new Options("right", "id", "video-button", 0, 0))));
        this.instructions.push(new Instruction("Oder über Audio kommunizieren!", new Array(new Options("right", "id", "audio-button", 0, 0))));
        this.instructions.push(new Instruction("Hier siehst du, was dein Partner gerade macht.", new Array(new Options("down", "id", "awareness-partner", -50, 160))));
        this.instructions.push(new Instruction("Hier siehst du die Phasen der Sitzung.", new Array(new Options("down", "id", "ProgressBar", -45, 160))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 20))));

    }
}

export class SeparateSectionsTutorPrep extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTORPRE";
        this.instructions.push(new Instruction("Nun schaut ihr euch gemeinsam ein Video an und unterteilt es in Abschnitte.", ""));
        this.instructions.push(new Instruction("Später sollt ihr die Abschnitte zusammenfassen und euch gegenseitig vorstellen.", ""));
        this.instructions.push(new Instruction("Hier weiter!", new Array(new Options("right", "id", "ok-understand", 10, 0))));
    }
}

export class SeparateSectionsTuteePrep extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTEEPRE";
        this.instructions.push(new Instruction("Nun schaut ihr euch gemeinsam ein Video an und unterteilt es in Unterabschnitte.", ""));
        this.instructions.push(new Instruction("Später sollt ihr die Abschnitte zusammenfassen und euch gegenseitig vorstellen.", ""));
        this.instructions.push(new Instruction("Hier weiter!", new Array(new Options("right", "id", "ok-understand", 10, 0))));
    }
}

export class SeparateSectionsTutorPost extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTORPOST";
        this.instructions.push(new Instruction("Die Anzahl der Abschnitte sollte ein Vielfaches der Anzahl der Mitglieder sein.", ""));
        this.instructions.push(new Instruction("Für eine Zweiergruppe also 2, 4, 6, ... Abschnitte", ""));
        this.instructions.push(new Instruction("Nur du kannst die Einteilung vornehmen, kommuniziert deshalb miteinander.", ""));
        this.instructions.push(new Instruction("Starte hiermit das Video.", new Array(new Options("left", "id", "play-button", 20, 100))));
        this.instructions.push(new Instruction("Synched bedeutet: Ihr schaut gleichzeitig. ", new Array(new Options("right", "id", "sync-mode", 0, -60))));
        this.instructions.push(new Instruction("Über Annotations kannst du eine Unterteilung vornehmen. Wähle über den kleinen Pfeil links 'Chapter annotation'.", new Array(new Options("right", "id", "open-annotations", 10, -25))));
        this.instructions.push(new Instruction("Setze das Videosymbol jeweils an den Anfang eines Abschnitts.", ""));
        this.instructions.push(new Instruction("Wenn ihr in zwei Abschnitte Unterteilen wollt, setze auch zwei Symbole.", ""));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 10, 20))));
    }
}
export class SeparateSectionsTuteePost extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTEEPOST";
        this.instructions.push(new Instruction("Nun sollt ihr das Video erst einmal in Unterabschnitte unterteilen", ""));
        this.instructions.push(new Instruction("Die Anzahl der Abschnitte sollte ein Vielfaches der Gruppenmitglieder sein.", ""));
        this.instructions.push(new Instruction("Für eine Zweiergruppe also 2, 4, 6, ... Abschnitte", ""));
        this.instructions.push(new Instruction("Nur dein Partner kann die Einteilung vornehmen, kommuniziert deshalb miteinander.", ""));
        this.instructions.push(new Instruction("Das Video können beide Partner starten und darin navigieren.", new Array(new Options("left", "id", "play-button", 20, 100))));
        this.instructions.push(new Instruction("Synched bedeutet: Ihr schaut gleichzeitig. ", new Array(new Options("right", "id", "sync-mode", 0, -60))));
        this.instructions.push(new Instruction("Warte darauf, dass dein Partner die Phase beendet.", ""));

    }


}

export class PreparePre extends AbstractPhase {
    constructor() {
        super();
        this.name = "PREPAREPRE";
        this.instructions.push(new Instruction("In dieser Phase bereitest du jeweils aus einem Videoabschnitt einen Vortrag für deinen Partner vor.", ""));

    }


}

export class PreparePost extends AbstractPhase {
    constructor() {
        super();
        this.name = "PREPAREPOST";
        this.instructions.push(new Instruction("Wie du siehst, kann jeder das Video nun separat anschauen.", new Array(new Options("right", "id", "sync-mode", 15, -120))));
        this.instructions.push(new Instruction("Hier beginnt dein Abschnitt (hell gekennzeicnet) ", new Array(new Options("down", "id", "asynch-timeline-handle", -70, 70))));
        this.instructions.push(new Instruction("Mache dir hier Notizen ", new Array(new Options("right", "id", "notes-tab", 15, 15))));
        this.instructions.push(new Instruction("Möchtest du in deinem Vortrag Bilder aus dem Video zeigen, kannst du diese über 'Annotate/Annotation' speichern.", new Array(new Options("right", "id", "open-annotations", 10, -30))));
        this.instructions.push(new Instruction("Über den Tab Annotations kannst du später darauf zugreifen", new Array(new Options("right", "id", "annotations-tab", 10, 0))));
        this.instructions.push(new Instruction("Bereite einen Vortrag für deinen Abschnitte vor", ""));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));
    }


}




export class PresentTuteePre extends AbstractPhase {
    constructor() {
        super();
        this.name = "PRESENTTUTEEPRE";
        this.instructions.push(new Instruction("In dieser Phase hörst dir den Vortrag deines Partners an.", ""));
    }


}



export class PresentTuteePost extends AbstractPhase {
    constructor() {
        super();
        this.name = "PRESENTTUTEEPOST";
        this.instructions.push(new Instruction("Stelle bei Bedarf Rückfragen.", ""));
        this.instructions.push(new Instruction("Mache dir hier Notizen ", new Array(new Options("right", "id", "notes-tab", 15, 0))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));
    }


}


export class PresentTutorPre extends AbstractPhase {
    constructor() {
        super();
        this.name = "PRESENTTUTORPRE";
        this.instructions.push(new Instruction("Stelle in dieser Phase deinem Partner deinen Vortrag vor.", ""));
    }


}



export class PresentTutorPost extends AbstractPhase {
    constructor() {
        super();
        this.name = "PRESENTTUTORPOST";
        this.instructions.push(new Instruction("Über Annotations gelangst du du deinen gespeicherten Bildern aus dem Video.", new Array(new Options("right", "id", "annotations-tab", 15, 0))));
        this.instructions.push(new Instruction("Klicke auf Marker, um in die Bilder des Videos zu zeichnen.", new Array(new Options("right", "id", "maker-button", 15, 0))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));
    }


}

export class DeepenTutorPre extends AbstractPhase {
    constructor() {
        super();
        this.name = "DEEPENTUTORPRE";
        this.instructions.push(new Instruction("Unterstüzte deinen Partner dabei, den Vortrag zusammenzufassen.", ""));

    }
}

export class DeepenTutorPost extends AbstractPhase {
    constructor() {
        super();
        this.name = "DEEPENTUTORPOST";
        this.instructions.push(new Instruction("Korrigiere das gemeinsame Dokument.", new Array(new Options("right", "id", "doc-tab", 15, 0))));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", new Array(new Options("right", "id", "ready-to-finish", 15, 0))));

    }
}

export class DeepenTuteePre extends AbstractPhase {
    constructor() {
        super();
        this.name = "DEEPENTUTEEPRE";
        this.instructions.push(new Instruction("Fasse den Inhalt des Vortrags in einem gemeinsamen Dokument zusammen.", ""));
    }
}

export class DeepenTuteePost extends AbstractPhase {
    constructor() {
        super();
        this.name = "DEEPENTUTEEPOST";
        this.instructions.push(new Instruction("Schreibe in das gemeinsame Dokument.", new Array(new Options("right", "id", "doc-tab", 15, 0))));
        this.instructions.push(new Instruction("Stelle bei Zweifeln Rückfragen an deinen Partner.", ""));
    }
}


export class ReflectionPre extends AbstractPhase {
    constructor(assignment) {
        super();
        this.name = "REFLECTIONPRE";
        if (assignment)
            this.instructions.push(new Instruction(assignment, ""));
        else
            this.instructions.push(new Instruction("Vertieft euer Wissen gemeinsam.", ""));

    }
}
export class ReflectionPost extends AbstractPhase {
    constructor() {
        super();
        this.name = "REFLECTIONPOST";
        this.instructions.push(new Instruction("Ihr könnt dafür auf alle bisherigen Methoden zugreifen.", ""));
    }
}