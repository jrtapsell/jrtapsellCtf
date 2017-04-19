interface Console {
    colourLog: (tagColor: string, textColor:string, textMessage:string, data?: any) => void;
    groupCollapsed(...a:string[]);
}

interface Element {
    dataset:{
        [key:string]:string | undefined
    };
}

type callbackTypes = "value";


interface MaterialLayout extends HTMLElement {
    MaterialLayout: {
        "toggleDrawer": () => void
    };
}

interface ProviderId {
    providerId: string
}

interface FirebaseUser {
    photoURL: string
    displayName: string
    uid: string
    email: string
    providerData: ProviderId[]
}

interface Dialogue extends HTMLElement {
    showModal: () => void;
    close: () => void;
}

interface EventTarget {
    location:Location;
}

interface Object {
    values:(any) => any
}

declare var CTF: {
    pages: {
        [key:string]: (data? : Object) => string
    }
};

declare var firebase: {
    "auth": any,
    "storage": any,
    "database": any,
    "initializeApp": any
};
