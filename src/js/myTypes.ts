interface Console {
    colourLog: (tagColor: string, textColor:string, textMessage:string, data?: any) => void;
    groupCollapsed(...a:string[]);
}

interface Element {
    dataset:{
        [key:string]:string
    };
}

interface MaterialLayout extends HTMLElement {
    MaterialLayout: {
        "toggleDrawer": () => void
    };
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
        challenge: () => {},
        challenges: () => {},
        home: () => {},
        index: () => {},
        login: () => {},
        user: () => {},
        users: () => {}
    }
};

declare var firebase: any;