import React, { Component } from "react";
import AbstractPhase from "./AbstractPhase";
import Instruction from "./Instruction";
import Options from "./Options";
import { STUDENTLOBBY } from "./types";


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
        this.instructions.push(new Instruction("Warte auf deinen Partner oder lade ihn über diese URL ein: " + this.url, ""));


    }

}



export class StudentLobby extends AbstractPhase {
    constructor() {
        super();
        this.name = STUDENTLOBBY;
        this.instructions.push(new Instruction("Willkommmen in der Lobby für das kollaborative Arbeiten mit Videos in Partnerarbeit.", ""));
        this.instructions.push(new Instruction("Ich bin dein Assistent und werde dich durch die Sitzung leiten.", ""));

        this.instructions.push(new Instruction("Unten siehst du die Videosessions, die dir zur Verfügung stehen.", ""));

        this.instructions.push(new Instruction("Um eine Sitzung durchzuführen, müssen beide Partner der Session beitreten.", ""));
        this.instructions.push(new Instruction("Starte mit den grünen Buttons eine Sitzung ", "join-session"));

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
        this.instructions.push(new Instruction("Du kannst den Chat dafür nutzen! ", "chat-write"));
        this.instructions.push(new Instruction("Oder eine Videoübertragung starten!", "video-button"));
        this.instructions.push(new Instruction("Oder über Audio kommunizieren!",  "audio-button"));
        this.instructions.push(new Instruction("Hier siehst du, was dein Partner gerade macht.", "awareness-partner"));
        this.instructions.push(new Instruction("Hier siehst du die Phasen der Sitzung.", "ProgressBar"));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", "ready-to-finish"));

    }
}

export class SeparateSectionsTutorPrep extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTORPRE";
        this.instructions.push(new Instruction("Nun schaut ihr euch gemeinsam ein Video an und unterteilt es in Abschnitte.", ""));
        this.instructions.push(new Instruction("Später sollt ihr die Abschnitte zusammenfassen und euch gegenseitig vorstellen.", ""));
        this.instructions.push(new Instruction("Hier weiter!", "ok-understand"));
    }
}

export class SeparateSectionsTuteePrep extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTEEPRE";
        this.instructions.push(new Instruction("Nun schaut ihr euch gemeinsam ein Video an und unterteilt es in Unterabschnitte.", ""));
        this.instructions.push(new Instruction("Später sollt ihr die Abschnitte zusammenfassen und euch gegenseitig vorstellen.", ""));
        this.instructions.push(new Instruction("Hier weiter!", "ok-understand"));
    }
}

export class SeparateSectionsTutorPost extends AbstractPhase {
    constructor() {
        super();
        this.name = "SEPARATESECTIONSTUTORPOST";
        this.instructions.push(new Instruction("Die Anzahl der Abschnitte sollte ein Vielfaches der Anzahl der Mitglieder sein.", ""));
        this.instructions.push(new Instruction("Für eine Zweiergruppe also 2, 4, 6, ... Abschnitte", ""));
        this.instructions.push(new Instruction("Nur du kannst die Einteilung vornehmen, kommuniziert deshalb miteinander.", ""));
        this.instructions.push(new Instruction("Starte hiermit das Video.", "play-button"));
        this.instructions.push(new Instruction("Synched bedeutet: Ihr schaut gleichzeitig. ", "synchswitch"));
        this.instructions.push(new Instruction("Mit diesem Button kannst du einen Abschnitt definieren.", "open-annotations"));
        this.instructions.push(new Instruction("Setze das Videosymbol jeweils an den Anfang eines Abschnitts.", ""));
        this.instructions.push(new Instruction("Wenn ihr in zwei Abschnitte unterteilen wollt, setze auch zwei Symbole.", ""));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", "ready-to-finish"));
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
        this.instructions.push(new Instruction("Das Video können beide Partner starten und darin navigieren.",  "play-button"));
        this.instructions.push(new Instruction("Synched bedeutet: Ihr schaut gleichzeitig. ", "synchswitch"));
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
      //  this.instructions.push(new Instruction("Dein Partner bereitet seine Abschnitte parallel dazu für dich vor.", ""));
        this.instructions.push(new Instruction("Wie du siehst, kann jeder das Video nun separat anschauen.", "sync-mode"));
        this.instructions.push(new Instruction("Hier beginnt dein Abschnitt (hell gekennzeichnet) ", "asynch-timeline-handle"));
        this.instructions.push(new Instruction("Mache dir hier Notizen.", "notes-tab"));
        this.instructions.push(new Instruction("Möchtest du in deinem Vortrag Bilder aus dem Video zeigen, kannst du diese über 'Annotate' speichern.", "annot-button"));
        this.instructions.push(new Instruction("Über den Tab 'Annotations' kannst du später darauf zugreifen", "annotations-tab"));
        this.instructions.push(new Instruction("Bereite einen Vortrag für deinen Abschnitt vor", ""));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", "ready-to-finish"));
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
        this.instructions.push(new Instruction("Mache dir hier Notizen ", "notes-tab"));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", "ready-to-finish"));
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
        this.instructions.push(new Instruction("Über 'Annotations' gelangst du du deinen gespeicherten Bildern aus dem Video.", "annotations-tab"));
        this.instructions.push(new Instruction("Klicke auf Marker, um in die Bilder des Videos zu zeichnen.", "maker-button"));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", "ready-to-finish",));
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
        this.instructions.push(new Instruction("Dein Partner schreibt in das gemeinsame Dokument. Hilf und korrigiere.", "doc-tab"));
        this.instructions.push(new Instruction("Ihr könnte bei Unklarheiten im Video nachschauen.", "video-tab"));
        this.instructions.push(new Instruction("Mit diesem Button leitest du die nächste Phase ein.", "ready-to-finish"));

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
        this.instructions.push(new Instruction("Schreibe ins gemeinsame Dokument.", "doc-tab"));
        this.instructions.push(new Instruction("Ihr könnte bei Unklarheiten im Video nachschauen.", "video-tab"));
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
        this.instructions.push(new Instruction("Ihr könnt das Video im synchronen oder asynchronen Modus schauen.", "synchswitch"));
        this.instructions.push(new Instruction("Mit diesem Button leitest du das Ende der Sitzung ein.", "ready-to-finish"));

    }
}
export class Completion extends AbstractPhase {
    constructor() {
        super();
        this.name = "COMPLETION";
        this.instructions.push(new Instruction("Klicke auf den Link zur Beantwortung des Fragebogens!", ""));
       
    }


}