
import {YAIS} from "../core/YAIS";

function craeteString(l:number) {
    let str:string = '';
    while (l>0) {
        str += 'test ';
        l--;
    }

    return str;
}

// Create data source
let data_source:Array<string> = [];
for (let i = 0; i < 50000; i++) {
    let l:number = (Math.random() * 100) + 1;
    let str:string = (i+1) + ' - ' + craeteString(l);
    data_source.push(str);
}


let scroll_comp:YAIS;

scroll_comp = new YAIS(true);
scroll_comp.init(document.getElementById("infinite-scroll-cont"), data_source, 40, false);
scroll_comp.onScrollListener(null);
scroll_comp.scrollListenerEnabled();