interface Console {
    colourLog: (tagColor: string, textColor:string, textMessage:string, data?: any) => void;
    groupCollapsed(...a:string[]);
}

interface Element {
    dataset:{
        [key:string]:string
    };
    MaterialLayout:any;
}

interface HTMLElement {
    showModal: () => void;
    files: FileList;
    close: () => void;
}

interface EventTarget {
    location:Location;
}

interface Object {
    values:(any) => any
}

declare var CTF: any;
declare var fb: any;
declare var firebase: any;