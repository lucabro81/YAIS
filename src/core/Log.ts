import {IBaseClass} from "./IBaseClass";

class Log {

    static is_debug:boolean = false;

    static d(context:IBaseClass,
             method:string,
             is_in_box:boolean = false,
             ...output:Array<{tag:string, value:any}>):void {

        if (!Log.is_debug) {
            return;
        }

        console.log("%c** " + context.name + " **", "font-size:20px; font-weight: bold");
        console.log("%cMethod: " + method, "font-size: 15px; font-style: italic");

        //console.groupCollapsed("Stack trace: ");
        //console.trace(method);
        //console.groupEnd();

        console.log("%cOutput:", "font-size: 15px; font-style: italic");

        let l:number = output.length;
        if (l > 0) {

            // max tag.length
            let max_lun:number = 0;
            for (let i = 0; i < l; i++) {
                let out_item: { tag: string, value: any } = output[i];
                let tag_len:number = out_item.tag.length;
                if (tag_len > max_lun) {
                    max_lun = tag_len;
                }
            }

            // normalization tag.length
            for (let i = 0; i < l; i++) {
                let out_item: { tag: string, value: any } = output[i];
                let dots_n:number = max_lun - out_item.tag.length + 3;
                out_item.tag += ": ";
                for (let j = 0; j<dots_n; j++) {
                    out_item.tag += ".";
                }
            }

            // print debug info
            for (let i = 0; i < l; i++) {
                let out_item: { tag: string, value: any } = output[i];
                if (out_item) {
                    console.log("\t\t" + out_item.tag, "(" + Log.toType(out_item.value) + ")", out_item.value);
                }
            }
        }

    }

    static i() {

    }

    static e() {

    }

    // https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
    static toType(obj):string {
        if (obj && obj.name) {
            return obj.name;
        }
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }

} export {Log};