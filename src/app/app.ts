import {YAIS} from "../core/YAIS";
import {AbsScrollListener} from "../core/abs/AbsScrollListener";
import {Settings} from "../core/utils/Enums";

////////////////////////////////////////////////////////////
//////////////////// CREATE DATA SOURCE ////////////////////
////////////////////////////////////////////////////////////

/**
 *
 * @param l
 * @returns {string}
 */
function craeteString(l:number) {
    let str:string = '';
    while (l>0) {
        str += 'test ';
        l--;
    }

    return str;
}

let data_source:Array<string> = [];
for (let i = 0; i < 170; i++) {
    let l:number = (Math.random() * 100) + 1;
    let str:any = '<strong>' + (i+1) + '</strong>' + ' - ' + craeteString(l);
    data_source.push(str);
}

///////////////////////////////////////////////////////////
//////////////////// INIT LIST OPTIONS ////////////////////
///////////////////////////////////////////////////////////

let scroll_comp:YAIS;

scroll_comp = new YAIS(true);

scroll_comp.setOptionHTMLElement(Settings.CONTAINER, document.getElementById("infinite-scroll-cont"));
scroll_comp.setOptionArray<string>(Settings.DATA, data_source);
scroll_comp.setOptionNumber(Settings.ITEMS_PER_PAGE, 30);
scroll_comp.setOptionBoolean(Settings.LOOP, true);
scroll_comp.setOptionNumber(Settings.BOTTOM_REACHED, 600);
scroll_comp.setOptionNumber(Settings.TOP_REACHED, 600);

//////////////////////////////////////////////////////////////////
//////////////////// SET LISTENERS / HANDLERS ////////////////////
//////////////////////////////////////////////////////////////////

scroll_comp.setOnScrollListener(new class OnScrollListener extends AbsScrollListener {
    public topReached(evt:any, yais:YAIS):void {
        super.topReached(evt);
        yais.addElemsToTop();
        console.log("topReached!!!");
    }
    public bottomReached(evt:any, yais:YAIS):void {
        super.bottomReached(evt);
        yais.addElemsToBottom();
        console.log("SCROLLDOWN!!!!!")
    }
}());
//scroll_comp.setOnScrollListener(null);

scroll_comp.onScrollStartGoingDown.add(() => {
    console.log("onScrollStartGoingDown");
}, this);

scroll_comp.onScrollStartGoingUp.add(() => {
    console.log("onScrollStartGoingUp");
}, this);

scroll_comp.onScrollFinishGoingDown.add(() => {
    console.log("onScrollFinishGoingDown");
}, this);

scroll_comp.onScrollFinishGoingUp.add(() => {
    console.log("onScrollFinishGoingUp");
}, this);

scroll_comp.onOutOfData.add(() => {
    console.log("onOutOfData");
}, this);

//////////////////////////////////////////////////////////
//////////////////// START ENGINES ON ////////////////////
//////////////////////////////////////////////////////////

scroll_comp.init();

window['yais'] = scroll_comp;