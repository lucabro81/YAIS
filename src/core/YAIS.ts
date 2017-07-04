import {LinkedList} from "lucabro-linked-list/package/LinkedList";
import {ListElement} from "lucabro-linked-list/package/ListElement";

import {ElemPosition, Settings} from "./utils/Enums";
import {Const} from "./utils/Const";

import Events = Const.Events;
import {Signal} from "signals";

class YAIS {

    public onScrollStartGoingUp:Signal = new Signal();
    public onScrollGoingUp:Signal = new Signal();
    public onScrollFinishGoingUp:Signal = new Signal();
    public onScrollStartGoingDown:Signal = new Signal();
    public onScrollGoingDown:Signal = new Signal();
    public onScrollFinishGoingDown:Signal = new Signal();
    public onOutOfData:Signal = new Signal();

    public data:Array<any>;
    public template_item:Node;
    public ll:LinkedList<ListElement>;
    public items_per_page:number;
    public start:ListElement;
    public end:ListElement;
    public current_page:number;

    private container:HTMLElement;
    private length:number;
    private pages:number;
    private outer_container:HTMLElement;
    private handler:(evt:any) => void;
    private top_reached_handler:(evt:any, scope?:YAIS) => void;
    private bottom_reached_handler:(evt:any, scope?:YAIS) => void;
    private start_scroll_up_handler:(evt:any, scope?:YAIS) => void;
    private scroll_up_handler:(evt:any, scope?:YAIS) => void;
    private finish_scroll_up_handler:(evt:any, scope?:YAIS) => void;
    private start_scroll_down_handler:(evt:any, scope?:YAIS) => void;
    private scroll_down_handler:(evt:any, scope?:YAIS) => void;
    private finish_scroll_down_handler:(evt:any, scope?:YAIS) => void;
    private on_scroll_event_handler:(evt:any) => void;
    private previous_scroll_value:number;
    private current_elem_height:number;
    private bottom_reached:number;
    private top_reached:number;
    private interval_going_down:number;
    private interval_going_up:number;
    private is_loop:boolean;
    private is_scroll_up_enabled:boolean;
    private is_scroll_down_enabled:boolean;
    private is_scroll_avaible:boolean;
    private is_debug_enabled:boolean;
    private is_going_down:boolean;
    private is_going_up:boolean;
    private is_going_down_started:boolean;
    private is_going_up_started:boolean;
    private is_out_of_data:boolean;
    private custom_listener_obj:IOnScrollListener;
    private rest:number;
    private max_page_number:number;

    constructor(is_debug_enabled:boolean = false) {

        this.enableDebug(is_debug_enabled);

        this.data = [];
        this.template_item = null;
        this.ll = null;
        this.items_per_page = 0;
        this.start = null;
        this.end = null;

        this.container = null;
        this.length = 0;
        this.pages = 0;
        this.current_page = 1;
        this.outer_container = null;
        this.handler = null;

        this.top_reached_handler = null;
        this.bottom_reached_handler = null;
        this.start_scroll_up_handler = null;
        this.scroll_up_handler = null;
        this.finish_scroll_up_handler = null;
        this.start_scroll_down_handler = null;
        this.scroll_down_handler = null;
        this.finish_scroll_down_handler = null;
        this.on_scroll_event_handler = null;

        this.previous_scroll_value = 0;
        this.current_elem_height = 0;
        this.bottom_reached = 0;
        this.top_reached = 0;
        this.interval_going_down = 0;
        this.interval_going_up = 0;
        this.is_loop = false;
        this.is_scroll_up_enabled = false;
        this.is_scroll_down_enabled = false;
        this.is_scroll_avaible = true;
        this.is_going_down = false;
        this.is_going_up = false;
        this.is_going_down_started = true;
        this.is_going_up_started = true;
        this.is_out_of_data = false;
        this.custom_listener_obj = null;
        this.rest = 0;
        this.max_page_number = 0;
    }

////////////////////////////////////////////////
//////////////////// PUBLIC ////////////////////
////////////////////////////////////////////////

    public init() {

        // Initialization error
        if (this.data.length === 0) {
            throw new Error("No Data Error");
        }

        if (this.outer_container === null) {
            throw new Error("No Container Defined Error");
        }

        if (this.on_scroll_event_handler === null) {
            throw new Error("No ScrollEvent Handler Defined Error");
        }

        // Set default
        if (this.items_per_page === 0) {
            this.items_per_page = 30;
        }

        if (this.template_item === null) {
            this.initDefaultItemElem();
        }

        if (this.bottom_reached === 0) {
            this.bottom_reached = 600;
        }

        if (this.top_reached === 0) {
            this.top_reached = 600;
        }

        // Init
        this.pages = 1; // TODO: verificare che serva a qualcosa
        this.max_page_number = Math.ceil(this.data.length/this.items_per_page);
        this.rest = this.data.length % this.items_per_page;

        console.log("this.max_page_number", this.max_page_number);
        console.log("this.rest", this.rest);

        this.initList();
        this.initParams();
        this.setOnScrollEnabled(true, true);
    }

    public setOnScrollEnabled(value_up:boolean, value_down:boolean) {
        this.is_scroll_up_enabled = value_up;
        this.is_scroll_down_enabled = value_down;
    }

    public setOnScrollListener(listener:IOnScrollListener = null) {

        this.top_reached_handler = (listener) ? listener.topReached : this.defaultTopReachedHandler;
        this.bottom_reached_handler = (listener) ? listener.bottomReached : this.defaultBottomReachedHandler;

        this.start_scroll_up_handler = (listener) ? listener.startScrollUp : (evt:any, scope?:YAIS) => {};
        this.scroll_up_handler = (listener) ? listener.scrollUp : (evt:any, scope?:YAIS) => {};
        this.finish_scroll_up_handler = (listener) ? listener.finishScrollUp : (evt:any, scope?:YAIS) => {};

        this.start_scroll_down_handler = (listener) ? listener.startScrollDown : (evt:any, scope?:YAIS) => {};
        this.scroll_down_handler = (listener) ? listener.scrollDown : (evt:any, scope?:YAIS) => {};
        this.finish_scroll_down_handler = (listener) ? listener.finishScrollDown : (evt:any, scope?:YAIS) => {};

        this.custom_listener_obj = listener;

        this.onScrollListener();
    }

    public setOptionHTMLElement(option:Settings, value:HTMLElement):void {
        switch (option) {
            case Settings.CONTAINER:
                //let outer_container:HTMLElement = <HTMLElement>value;
                let outer_container:HTMLElement = <HTMLElement>value;
                this.outer_container = value;

                this.initContainer(outer_container);
                break;
        }
    }

    public setOptionString(option:Settings, value:string):void {
        switch (option) {
            case Settings.ITEM_TEMPLATE:
                this.setTemplateItem(value);
                break;
        }
    }

    public setOptionArray<T>(option:Settings, value:Array<T>):void {
        switch (option) {
            case Settings.DATA:
                this.data = value;
                break;
        }
    }

    public setOptionNumber(option:Settings, value:number):void {
        switch (option) {
            case Settings.ITEMS_PER_PAGE:
                this.items_per_page = value;
                break;
            case Settings.BOTTOM_REACHED:
                this.bottom_reached = value;
                break;
            case Settings.TOP_REACHED:
                this.top_reached = value;
                break;
        }
    }

    public setOptionBoolean(option:Settings, value:boolean):void {
        switch (option) {
            case Settings.LOOP:
                this.is_loop = value;
                break;
        }
    }

    public setOptions(options:Map<Settings, any>):void {

        if (options.has(Settings.CONTAINER)) {
            this.setOptionHTMLElement(Settings.CONTAINER, options.get(Settings.CONTAINER));
        }

        if (options.has(Settings.CLASS_ITEM)) {
            this.setOptionString(Settings.CLASS_ITEM, options.get(Settings.CLASS_ITEM));
        }

        if (options.has(Settings.DATA)) {
            this.setOptionArray<any>(Settings.DATA, options.get(Settings.DATA));
        }

        if (options.has(Settings.ITEMS_PER_PAGE)) {
            this.setOptionNumber(Settings.ITEMS_PER_PAGE, options.get(Settings.ITEMS_PER_PAGE));
        }

        if (options.has(Settings.BOTTOM_REACHED)) {
            this.setOptionNumber(Settings.BOTTOM_REACHED, options.get(Settings.BOTTOM_REACHED));
        }

        if (options.has(Settings.TOP_REACHED)) {
            this.setOptionNumber(Settings.TOP_REACHED, options.get(Settings.TOP_REACHED));
        }

        if (options.has(Settings.ITEM_TEMPLATE)) {
            this.setOptionString(Settings.ITEM_TEMPLATE, options.get(Settings.ITEM_TEMPLATE))
        }

        if (options.has(Settings.LOOP)) {
            this.setOptionBoolean(Settings.LOOP, options.get(Settings.LOOP))
        }
    }

    public updateData() {
        // TODO: concat?
    }

    public howManyItems() {

    }

    public howManyPages() {

    }

    public currentPage() {
        return this.current_page;
    }

    public addItemPrev(data:any): void {
        let new_elem:HTMLElement = this.createElem(data);
        this.ll.addElemLeft(new_elem);
        this.container.insertBefore(new_elem, this.ll.start.data);
    }

    public addItemNext(data:any): void {
        let new_elem:any = this.createElem(data);
        this.ll.addElem(new_elem);
        this.container.appendChild(this.ll.get().data);
    }

    public shiftNextItem(data:any) {
        let node_to_reattach:Node = this.ll.start.data;

        this.detachElem(node_to_reattach);
        this.ll.shiftLeft();
        (<HTMLElement>node_to_reattach).innerHTML = data;
        this.reattachElem(this.container,
            node_to_reattach,
            this.ll.end.prev.data,
            ElemPosition.AFTER);
    }

    public shiftPrevItem(data:any) {

        let node_to_reattach:Node = this.ll.end.data;

        this.detachElem(node_to_reattach);
        this.ll.shiftRight();
        (<HTMLElement>node_to_reattach).innerHTML = data;
        this.reattachElem(this.container,
            node_to_reattach,
            this.ll.start.next.data,
            ElemPosition.BEFORE);
    }

    public shiftNextPage() {

    }

    public shiftPrevPage() {

    }

    public insertItem() {

    }

    public removeItemPrev() {

    }

    public removeItemNext() {

    }

    public removeItem() {

    }

    public removePagPrev() {

    }

    public removePagNext() {

    }

    public removePag() {

    }

    public toEnd() {

    }

    public toStart() {

    }

    public isStart() {

    }

    public isEnd() {

    }

    public enableLoop(enable:boolean):void {
        this.is_loop = enable;
        if (this.is_loop) {
            if (!this.ll.isOuroborusActive()) {
                this.ll.doOuroboros();
            }
        }
        else {
            this.ll.undoOuroboros();
        }
    }

    public isLoopEnabled():boolean {
        return this.is_loop;
    }

    public enableDebug(enable:boolean) {
        this.is_debug_enabled = enable;
    }

    public isDebugEnabled() {
        return this.is_debug_enabled;
    }

    public isGoingUp():boolean {
        return this.outer_container.scrollTop < this.previous_scroll_value;
    }

    public goingUp(evt:any):void {
        this.is_going_down = false;
        this.is_going_up = true;

        this.onScrollGoingUp.dispatch();
        this.scroll_up_handler(evt, this);

        if (this.interval_going_up) {
            clearInterval(this.interval_going_up);
            this.interval_going_up = 0;
        }

        this.interval_going_up = setTimeout(() => {
            clearInterval(this.interval_going_up);
            this.interval_going_up = 0;
            this.is_going_up_started = true;
            this.onScrollFinishGoingUp.dispatch();
            this.finish_scroll_up_handler(evt, this)
        }, 300);
    }

    public isGoingDown():boolean {
        return this.outer_container.scrollTop > this.previous_scroll_value;
    }

    public goingDown(evt:any):void {
        this.is_going_down = true;
        this.is_going_up = false;

        this.onScrollGoingDown.dispatch();
        this.scroll_down_handler(evt, this);

        if (this.interval_going_down) {
            clearInterval(this.interval_going_down);
            this.interval_going_down = 0;
        }

        this.interval_going_down = setTimeout(() => {
            clearInterval(this.interval_going_down);
            this.interval_going_down = 0;
            this.is_going_down_started = true;
            this.onScrollFinishGoingDown.dispatch();
            //this.setOnScrollEnabled(true, true);
            this.finish_scroll_down_handler(evt, this);
        }, 300);
    }

    public cameBackFromGoingDown():boolean {
        return this.is_going_down;
    }

    public cameBackFromGoingUp():boolean {
        return this.is_going_up;
    }

    public bottomReached(offset:number):boolean {
        return (((this.outer_container.scrollTop) > (this.current_elem_height - offset)) &&
               ((this.current_page < this.max_page_number) || this.is_loop));
    }

    public topReached(offset:number):boolean {
        //console.log("this.current_page", this.current_page);
        return (((this.outer_container.scrollTop) < offset) && ((this.current_page > 0) || this.is_loop));
        // return ((this.outer_container.scrollTop) < offset && (this.current_page > 0));
    }

    public addElemsToBottom():void {

        console.log("this.current_page1", this.current_page);

        /*//let is_out_of_data:boolean = false;
        let local_rest:number = ((this.is_loop) && (this.is_out_of_data) && (this.rest > 0) && this.current_page === 0) ? (this.items_per_page - this.rest) : 0;
        //let local_rest:number = 0;
        this.is_out_of_data = false;

        console.log("local_rest", local_rest);
        console.log("this.is_out_of_data", this.is_out_of_data);

        this.setOnScrollEnabled(true, true);
        for (let i = (this.items_per_page * this.current_page) + local_rest;
             i < (this.items_per_page * (this.current_page + 1));
             i++) {
            console.log("i", i);
            if (this.data[i]) {
                this.shiftNextItem(this.data[i]);
            }
            else {
                if (!this.is_out_of_data) {
                    this.is_out_of_data = true;
                    // numero massimo raggiungibile meno indice raggiunto
                    //this.rest = this.items_per_page * (this.current_page + 1) - i;
                    this.onOutOfData.dispatch();
                }
                if (!this.is_loop) {
                    this.setOnScrollEnabled(true, false);
                    break;
                }
                else {
                    // se siamo in loop stampo i restanti ripartendo da 0
                    this.shiftNextItem(this.data[i - (this.data.length)]);
                }
            }
        }

        if (this.is_loop) {
            if (this.is_out_of_data) {
                // per poter ripartire da pagina 0
                // this.current_page = -1;
                this.current_page++;
            }
            //else {
                //this.rest = 0;
            //}
        }

        console.log("this.current_page2", this.current_page);*/
    }

    public addElemsToTop():void {

        console.log("this.current_page", this.current_page);

        this.setOnScrollEnabled(true, true);

        let local_rest:number = (this.is_out_of_data /*||((this.current_page === 0) && this.is_loop)*/) ? (this.items_per_page - this.rest) : 0;

        console.log("local_rest", local_rest);
        console.log("this.is_out_of_data", this.is_out_of_data);

        for (let i = ((this.items_per_page * this.current_page) - local_rest) - 1;
             i >= this.items_per_page * (this.current_page - 1);
             i--) {

            console.log("i", i);
            if (this.data[i]) {
                this.shiftPrevItem(this.data[i]);

                /*if (!this.is_loop) {
                    this.setOnScrollEnabled(false, true);
                    break;
                }
                else {
                    this.shiftPrevItem(this.data[i]);
                }*/
            }
            else {

            }
        }

        //this.rest = 0;
        this.is_out_of_data = false;
    }

    public destroy():void {

        this.destroyArray(this.data);

        this.ll.toStart();
        while (this.ll.isEnd()) {
            (<HTMLElement>this.ll.get().data).remove();
        }
        this.ll.destroy();

        this.outer_container.removeEventListener(Events.SCROLL_EVENT, this.on_scroll_event_handler);
        this.outer_container.remove();

        this.data = null;
        this.template_item = null;
        this.ll = null;
        this.items_per_page = null;
        this.start = null;
        this.end = null;

        this.container = null;
        this.length = null;
        this.pages = null;
        this.outer_container = null;
        this.handler = null;
        this.on_scroll_event_handler = null;
        this.previous_scroll_value = null;
        this.current_elem_height = null;

        this.is_loop = null;
        this.is_scroll_up_enabled = null;
        this.is_scroll_down_enabled = null;
        this.is_scroll_avaible = null;
        this.is_going_down = null;
        this.is_going_up = null;

        this.custom_listener_obj.destroy();
        for(let key in this.custom_listener_obj) {
            if (this.custom_listener_obj.hasOwnProperty(key)) {
                delete this.custom_listener_obj[key];
            }
        }
        this.custom_listener_obj = null;

        this.onScrollStartGoingUp.removeAll();
        this.onScrollGoingUp.removeAll();
        this.onScrollFinishGoingUp.removeAll();
        this.onScrollStartGoingDown.removeAll();
        this.onScrollGoingDown.removeAll();
        this.onScrollFinishGoingDown.removeAll();
        this.onOutOfData.removeAll();
    }

/////////////////////////////////////////////////
//////////////////// PRIVATE ////////////////////
/////////////////////////////////////////////////

    private onScrollListener(): void {
        this.outer_container.removeEventListener(Events.SCROLL_EVENT, this.on_scroll_event_handler);
        this.on_scroll_event_handler = this.createScrollEventHandler();
        this.outer_container.addEventListener(Events.SCROLL_EVENT, this.on_scroll_event_handler);
    }

    /**
     *
     * @param arr
     */
    private destroyArray(arr:Array<any>) {
        let l:number = arr.length;
        for (let i = l; i >= 0; i++) {
            arr.pop();
        }
    }

    private stigrancazzi(i:number):number {
        return i - (this.data.length * Math.floor(i / this.data.length));
    }

    /**
     *
     */
    private initList():void {

        this.ll = new LinkedList<ListElement>();
        this.ll.init(ListElement);


        /*for (let i = -20; i < this.items_per_page * 100; i++) {
            console.log("stigrancazzi", this.stigrancazzi(i));
        }*/


        let offset:number = (this.rest > 0 && this.is_loop) ? this.rest - this.items_per_page : 0;


        for (let i = offset; i < ((this.items_per_page * 4) + offset); i++) {
            //if (this.data[i]) {

            console.log("stigrancazzi", this.stigrancazzi(i));

            let index:number = this.stigrancazzi(i);
            let datum:any = this.data[index];


            this.ll.addElem(this.createElem(datum));
            this.container.appendChild(this.ll.get().data);

            if (index === 0) {
                let class_attr_value:string = this.container.lastElementChild.getAttribute('class');

                if (class_attr_value) {
                    class_attr_value += " " + "first";
                }
                else {
                    class_attr_value = "first";
                }

                this.container.lastElementChild.setAttribute("class", class_attr_value);
            }

        }

        if (this.is_loop) {
            var objControl: HTMLElement = <HTMLElement>document.getElementsByClassName("first")[0];
            this.container.parentElement.scrollTop = objControl.offsetTop - this.container.offsetTop;
        }

        /*if (this.is_loop) {
            this.ll.doOuroboros();
        }*/

    }

    /**
     *
     */
    private initParams():void {
        this.current_page += 2;
        this.current_elem_height = this.container.offsetHeight;
    }

    /**
     *
     * @param outer_container
     */
    private initContainer(outer_container:HTMLElement) {

        let inner_container_elem:HTMLElement = document.createElement("DIV");

        outer_container.style.overflow = "hidden";
        outer_container.style.overflowY = "scroll";

        outer_container.appendChild(inner_container_elem);

        this.container = inner_container_elem;
    }

    /**
     *
     * @param evt
     */
    private onScrollEventHandler(evt:any) {

        if (this.isGoingDown() && this.is_scroll_down_enabled) {

            this.is_going_up_started = true;

            if (this.is_going_down_started) {
                this.onScrollStartGoingDown.dispatch(evt);
                this.start_scroll_down_handler(evt, this);
                this.is_going_down_started = false;
            }

            if (this.cameBackFromGoingUp()) {
                this.current_page += 3;

                if (this.interval_going_up) {
                    clearInterval(this.interval_going_up);
                    this.onScrollFinishGoingUp.dispatch();
                    this.finish_scroll_up_handler(evt, this);
                }

            }
            this.goingDown(evt);
            this.scrollDownHandler(evt);
        }
        else if (this.isGoingUp() && this.is_scroll_up_enabled) {

            this.is_going_down_started = true;

            if (this.is_going_up_started) {
                this.onScrollStartGoingUp.dispatch(evt);
                this.start_scroll_up_handler(evt, this);
                this.is_going_up_started = false;
            }

            if (this.cameBackFromGoingDown()) {
                this.current_page -= 3;

                if (this.interval_going_down) {
                    clearInterval(this.interval_going_down);
                    this.onScrollFinishGoingDown.dispatch();
                    this.finish_scroll_down_handler(evt, this);
                }

            }
            this.goingUp(evt);
            this.scrollUpHandler(evt);
        }

        this.previous_scroll_value = this.outer_container.scrollTop;
    }

    private scrollDownHandler(evt:any):void {
        if (this.bottomReached(this.bottom_reached) && (this.is_scroll_avaible)) {

            this.is_scroll_avaible = false;

            this.bottom_reached_handler(evt, this);

            if (this.current_page < this.max_page_number) {
                this.current_page++;
            }
            else if (this.is_loop) {
                this.current_page = 0;
            }

            this.current_elem_height = this.container.offsetHeight;

            this.is_scroll_avaible = true;
        }
}

    private defaultBottomReachedHandler(evt:any, scope?:YAIS):void {
        this.addElemsToBottom();
    }

    private scrollUpHandler(evt:any):void {
        console.log("this.topReached(this.top_reached)", this.topReached(this.top_reached));
        if (this.topReached(this.top_reached) && (this.is_scroll_avaible)) {

            this.is_scroll_avaible = false;

            this.top_reached_handler(evt, this);

            if (this.current_page > 0) {
                this.current_page--;
            }
            else if (this.is_loop) {
                this.current_page = this.max_page_number;
            }

            this.current_elem_height = this.container.offsetHeight;

            this.is_scroll_avaible = true;
        }
    }

    private defaultTopReachedHandler(evt:any, scope?:YAIS):void {
        this.addElemsToTop();
    }

    /**
     *
     * @param handler
     * @returns {(evt:any)=>undefined}
     */
    private createScrollEventHandler(): (evt:any) => void {
        return (evt:any):void => {
            //if (this.is_scroll_enabled) {
                this.onScrollEventHandler(evt);
            //}
        }
    }

    /**
     *
     */
    private initDefaultItemElem():void {

        let template = document.createElement('template');
        template.innerHTML = "<div></div>";

        this.template_item = template.content.firstChild;
    }

    /**
     *
     * @param data
     * @returns {HTMLElement}
     */
    private createElem(data:any):HTMLElement {
        let new_elem:HTMLElement = <HTMLElement>this.template_item.cloneNode(true);
        (<HTMLElement>new_elem).innerHTML = data;
        return new_elem;
    }

    /**
     *
     * @param template_item
     */
    private setTemplateItem(template_item:string) {

        var template = document.createElement('template');
        template.innerHTML = template_item;

        this.template_item = template.content.firstChild;
    }

    /**
     *
     * @param node
     */
    private detachElem(node:Node): void {

        let parent = node.parentNode;

        if (!parent) { return; }

        parent.removeChild(node);
    }

    /**
     *
     * @param parent
     * @param node
     * @param ref_node
     * @param position  AFTER|BEFORE
     */
    private reattachElem(parent:HTMLElement,
                         node:Node, ref_node:Node,
                         position:ElemPosition = ElemPosition.AFTER): void {
        if (position === ElemPosition.BEFORE) {
            parent.insertBefore(node, ref_node);
        }
        if (position === ElemPosition.AFTER) {
            let next = ref_node.nextSibling;
            if (next) {
                parent.insertBefore(node, next);
            }
            else {
                parent.appendChild(node);
            }
        }
    }

} export {YAIS};