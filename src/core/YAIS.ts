import {LinkedList} from "lucabro-linked-list/package/LinkedList";
import {ListElement} from "lucabro-linked-list/package/ListElement";

import {IBaseClass} from "./IBaseClass";
import {Log} from "./Log";

import {ElemPosition, Settings} from "./Enums";
import {Const} from "./Const";

import Events = Const.Events;
import {Signal} from "signals";

class YAIS implements IBaseClass {

    public name:string = "YAIS";

    public onScrollStartGoingUp:Signal = new Signal();
    public onScrollGoingUp:Signal = new Signal();
    public onScrollFinishGoingUp:Signal = new Signal();
    public onScrollStartGoingDown:Signal = new Signal();
    public onScrollGoingDown:Signal = new Signal();
    public onScrollFinishGoingDown:Signal = new Signal();

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
    private scroll_up_handler:(evt:any) => void;
    private scroll_down_handler:(evt:any) => void;
    private on_scroll_event_handler:(evt:any) => void;
    private previous_scroll_value:number;
    private current_elem_height:number;
    private is_loop:boolean;
    private is_scroll_enabled:boolean;
    private is_scroll_avaible:boolean;
    private is_debug_enabled:boolean;
    private is_going_down:boolean;
    private is_going_up:boolean;

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
        this.on_scroll_event_handler = null;
        this.previous_scroll_value = 0;
        this.current_elem_height = 0;
        this.is_loop = false;
        this.is_scroll_enabled = false;
        this.is_scroll_avaible = true;
        this.is_going_down = false;
        this.is_going_up = false;

        Log.d(this, "constructor", false);
    }

////////////////////////////////////////////////
//////////////////// PUBLIC ////////////////////
////////////////////////////////////////////////

    /*public init(container:HTMLElement,
                data:Array<any>,
                items_per_page:number,
                loop:boolean = false) {

        Log.d(this, "init", false);

        this.data = data;
        this.items_per_page = items_per_page;
        this.pages = 1;
        this.length = this.items_per_page;
        this.is_loop = loop;
        this.outer_container = container;

        this.initContainer(this.outer_container);
        this.initDefaultItemElem();
        this.initList();
        this.initParams();
        //this.onScrollListener();

        // TODO: validazione elementi input (container, data, items_per_page, obbligatori)
    }*/

    public init() {

        Log.d(this, "init", false);

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

        // Init
        this.pages = 1; // TODO: verificare che serva a qualcosa

        this.initList();
        this.initParams();
        //this.onScrollListener();

        // TODO: validazione elementi input (container, data, items_per_page, obbligatori)
    }

    public setOnScrollEnabled(value:boolean) {
        this.is_scroll_enabled = value;
    }

    public setOnScrollListener(listener:IOnScrollListener = null) {
        this.scroll_up_handler = (listener) ? listener.scrollUp : this.defaultScrollUpHandler;
        this.scroll_down_handler = (listener) ? listener.scrollDown : this.defaultScrollDownHandler;
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

    public addPagPrev() {

    }

    public addPagNext() {

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

    public enableLoop():void {
        this.is_loop = true;
    }

    public isLoopEnabled():boolean {
        return this.is_loop;
    }

    public enableDebug(enable:boolean) {
        this.is_debug_enabled = enable;
        Log.is_debug = this.is_debug_enabled;
    }

    public isDebugEnabled() {
        return this.is_debug_enabled;
    }

    public isGoingUp():boolean {
        return this.outer_container.scrollTop < this.previous_scroll_value;
    }

    public goingUp():void {
        this.is_going_down = false;
        this.is_going_up = true;
    }

    public isGoingDown():boolean {
        return this.outer_container.scrollTop > this.previous_scroll_value;
    }

    public goingDown():void {
        this.is_going_down = true;
        this.is_going_up = false;
    }

    public cameBackFromGoingDown():boolean {
        return this.is_going_down;
    }

    public cameBackFromGoingUp():boolean {
        return this.is_going_up;
    }

    public bottomReached(offset:number):boolean {
        return ((this.outer_container.scrollTop) > this.current_elem_height - offset);
    }

    public topReached(offset:number):boolean {
        return ((this.outer_container.scrollTop) < offset && this.current_page > 0);
    }

    public addElemsToBottom():void {
        for (let i = this.items_per_page * this.current_page;
             i < this.items_per_page * (this.current_page + 1);
             i++) {
            this.shiftNextItem(this.data[i]);
        }
    }

    public addElemsToTop():void {
        for (let i = (this.items_per_page * this.current_page) - 1;
             i >= this.items_per_page * (this.current_page - 1);
             i--) {
            this.shiftPrevItem(this.data[i]);
        }
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
        this.is_scroll_enabled = null;
        this.is_scroll_avaible = null;
        this.is_going_down = null;
        this.is_going_up = null;

        this.onScrollStartGoingUp.removeAll();
        this.onScrollGoingUp.removeAll();
        this.onScrollFinishGoingUp.removeAll();
        this.onScrollStartGoingDown.removeAll();
        this.onScrollGoingDown.removeAll();
        this.onScrollFinishGoingDown.removeAll();
    }

/////////////////////////////////////////////////
//////////////////// PRIVATE ////////////////////
/////////////////////////////////////////////////

    private onScrollListener(): void {

        //Log.d(this, "onScrollLister", false, {tag: "handler", value: handler});

        //if (this.on_scroll_event_handler !== null)
        this.outer_container.removeEventListener(Events.SCROLL_EVENT, this.on_scroll_event_handler);
        //}

        // this.on_scroll_event_handler = this.createScrollEventHandler(handler);
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
    /**
     *
     */
    private initList():void {

        this.ll = new LinkedList<ListElement>();
        this.ll.init(ListElement);

        for (let i = 0; i < this.items_per_page*3; i++) {
            if (this.data[i]) {
                this.ll.addElem(this.createElem(this.data[i]));
                this.container.appendChild(this.ll.get().data);
            }
            else {
                break;
            }
        }
        Log.d(this, "initList", false, {tag: "list", value: this.ll});
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

        if (this.isGoingDown()) {
            if (this.cameBackFromGoingUp()) {
                this.current_page += 3;
            }
            this.goingDown();
            this.scroll_down_handler(evt);
        }
        else if (this.isGoingUp()) {
            if (this.cameBackFromGoingDown()) {
                this.current_page -= 3;
            }
            this.goingUp();
            this.scroll_up_handler(evt);
        }

        this.previous_scroll_value = this.outer_container.scrollTop;
    }

    private defaultScrollDownHandler(evt:any):void {
        if (this.bottomReached(600) && (this.is_scroll_avaible)) {

            this.is_scroll_avaible = false;

            this.addElemsToBottom();
            this.current_page++;
            this.current_elem_height = this.container.offsetHeight;

            this.is_scroll_avaible = true;
        }
    }

    private defaultScrollUpHandler(evt:any):void {
        if (this.topReached(600) && (this.is_scroll_avaible)) {

            this.is_scroll_avaible = false;

            this.addElemsToTop();
            this.current_page--;
            this.current_elem_height = this.container.offsetHeight;

            this.is_scroll_avaible = true;
        }
    }

    /**
     *
     * @param handler
     * @returns {(evt:any)=>undefined}
     */
    //private createScrollEventHandler(handler:(evt:any) => void) {
    private createScrollEventHandler(): (evt:any) => void {

        /*Log.d(this, "createScrollEventHandler", false, {tag: "handler", value: handler});
        this.handler = handler;

        if (handler === null) {
            return (evt:any):void => {
                if (this.is_scroll_enabled) {
                    this.onScrollEventDefaultHandler(evt);
                }
            }
        }

        return (evt:any):void => {
            if (this.is_scroll_enabled) {
                this.handler(evt);
            }
        }*/

        return (evt:any):void => {
            if (this.is_scroll_enabled) {
                this.onScrollEventHandler(evt);
            }
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