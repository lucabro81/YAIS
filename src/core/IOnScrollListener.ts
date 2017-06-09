interface IOnScrollListener {

    topReached(evt:any, instance?:any):void;
    bottomReached(evt:any, instance?:any):void;

    startScrollUp(evt:any, instance?:any):void;
    scrollUp(evt:any, instance?:any):void;
    finishScrollUp(evt:any, instance?:any):void;

    startScrollDown(evt:any, instance?:any):void;
    scrollDown(evt:any, instance?:any):void;
    finishScrollDown(evt:any, instance?:any):void;

}