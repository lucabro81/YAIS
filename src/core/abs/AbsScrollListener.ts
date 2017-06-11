import {AbsListener} from "./AbsListener";

export class AbsScrollListener extends AbsListener {

    constructor() {
        super();
    }

    public topReached(evt:any, instance?:any):void {}
    public bottomReached(evt:any, instance?:any):void {}

    public startScrollUp(evt:any, instance?:any):void {}
    public scrollUp(evt:any, instance?:any):void {}
    public finishScrollUp(evt:any, instance?:any):void {}

    public startScrollDown(evt:any, instance?:any):void {}
    public scrollDown(evt:any, instance?:any):void {}
    public finishScrollDown(evt:any, instance?:any):void {}
}