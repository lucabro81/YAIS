import {YAIS} from "../core/YAIS";
import {AbsScrollListener} from "../core/abs/AbsScrollListener";
import {Settings} from "../core/Enums";

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
    let str:any = '<strong>' + (i+1) + '</strong>' + ' - ' + craeteString(l);
    data_source.push(str);
}


let scroll_comp:YAIS;

scroll_comp = new YAIS(true);

scroll_comp.setOptionHTMLElement(Settings.CONTAINER, document.getElementById("infinite-scroll-cont"));
scroll_comp.setOptionArray<string>(Settings.DATA, data_source);
scroll_comp.setOptionNumber(Settings.ITEMS_PER_PAGE, 40);
scroll_comp.setOptionBoolean(Settings.LOOP, false);
/*
class OnScrollListener extends AbsScrollListener {
    public scrollUp(evt:any):void { super.scrollUp(evt); console.log("SCROLLUP!!!") };
    public scrollDown(evt:any):void { super.scrollDown(evt); console.log("SCROLLDOWN!!!!!") }
}
scroll_comp.setOnScrollListener(new OnScrollListener());
*/
scroll_comp.setOnScrollListener(null);

scroll_comp.init();

scroll_comp.setOnScrollEnabled(true);