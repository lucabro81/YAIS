
import {IBaseClass} from "./IBaseClass";
import {Log} from "./Log";

import {LinkedList} from "lucabro-linked-list/package/LinkedList";
import {ListElement} from "lucabro-linked-list/package/ListElement";

import {Enumerations} from "./Enums";
import {Const} from "./Const";

import ElemPosition = Enumerations.ElemPosition;
import Events = Const.Events;

class YAIS implements IBaseClass {

    public name:string = "YAIS";

    public data:Array<any>;
    public template_item:Node;
    public ll:LinkedList<ListElement>;
    public items_per_page:number;
    public start:ListElement;
    public end:ListElement;

    private container:HTMLElement;
    private length:number;
    private pages:number;
    private current_page:number;
    private outer_container:HTMLElement;
    private handler:(evt:any) => void;
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

    public init(container:HTMLElement,
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
    }

    public scrollListenerEnabled() {
        this.is_scroll_enabled = true;
    }

    public scrollListenerDisabled() {
        this.is_scroll_enabled = false;
    }

    public onScrollListener(handler:(evt:any) => void = null): void {

        //Log.d(this, "onScrollLister", false, {tag: "handler", value: handler});

        //if (this.on_scroll_event_handler !== null)
            this.outer_container.removeEventListener(Events.SCROLL_EVENT, this.on_scroll_event_handler);
        //}

        this.on_scroll_event_handler = this.createScrollEventHandler(handler);

        this.outer_container.addEventListener(Events.SCROLL_EVENT, this.on_scroll_event_handler);
    }

    public setTemplateItem(template_item:string) {

        var template = document.createElement('template');
        template.innerHTML = template_item;

        this.template_item = template.content.firstChild;
    }

    public setData(data:any) {
        this.data = data;
    }

    public updateData() {
        // TODO: concat?
    }

    public howManyItems() {

    }

    public howManyPages() {

    }

    public currentPage() {

    }

    public addItemPrev(data:any): void {

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

        console.log("sdffssd");

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

    public enableLoop() {

    }

    public isLoopEnabled() {

    }

    public enableDebug(enable:boolean) {
        this.is_debug_enabled = enable;
        Log.is_debug = this.is_debug_enabled;
    }

    public isDebugEnabled() {
        return this.is_debug_enabled;
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
    }

/////////////////////////////////////////////////
//////////////////// PRIVATE ////////////////////
/////////////////////////////////////////////////

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
    private onScrollEventDefaultHandler(evt:any) {

        if (this.isGoingDown()) {

            if (this.cameBackFromGoingUp()) {
                // settare pagina corrente corretta
                this.current_page += 3;
            }

            console.log("giù " + this.current_page);

            this.goingDown();

            if (this.bottomReached(600) && (this.is_scroll_avaible)) {

                console.log("asdfasdfa");

                this.is_scroll_avaible = false;

                this.addElemsToBottom();
                this.current_page++;
                this.current_elem_height = this.container.offsetHeight;

                this.is_scroll_avaible = true;
            }
        }
        else if (this.isGoingUp()) {

            if (this.cameBackFromGoingDown()) {
                // settare pagina corrente corretta
                this.current_page -= 3;
            }

            console.log("su " + this.current_page);

            this.goingUp();

            if (this.topReached(600) && (this.is_scroll_avaible)) {

                console.log("dioporco");

                this.is_scroll_avaible = false;

                this.addElemsToTop();
                this.current_page--;
                this.current_elem_height = this.container.offsetHeight;

                this.is_scroll_avaible = true;
            }
        }

        this.previous_scroll_value = this.outer_container.scrollTop;
    }

    private isGoingUp():boolean {
        return this.outer_container.scrollTop < this.previous_scroll_value;
    }

    private goingUp():void {
        this.is_going_down = false;
        this.is_going_up = true;
    }

    private isGoingDown():boolean {
        return this.outer_container.scrollTop > this.previous_scroll_value;
    }

    private goingDown():void {
        this.is_going_down = true;
        this.is_going_up = false;
    }

    private cameBackFromGoingDown():boolean {
        return this.is_going_down;
    }

    private cameBackFromGoingUp():boolean {
        return this.is_going_up;
    }

    private bottomReached(offset:number):boolean {
        return ((this.outer_container.scrollTop) > this.current_elem_height - offset);
    }

    private topReached(offset:number):boolean {

        //if (((infinity_scroll_cont.scrollTop) < (app.padding_top + 600)) && (is_scroll_avaible)) {

        return ((this.outer_container.scrollTop) < offset && this.current_page > 0);
    }

    private addElemsToBottom():void {
        for (let i = this.items_per_page * this.current_page;
             i < this.items_per_page * (this.current_page + 1);
             i++) {

            //if (this.current_page > 2) {
                this.shiftNextItem(this.data[i]);
            //}
            //else {
            //    this.addItemNext(this.data[i]);
            //}
        }
    }

    private addElemsToTop() {
        for (let i = (this.items_per_page * this.current_page) - 1;
             i >= this.items_per_page * (this.current_page - 1);
             i--) {

            //if (this.current_page > 2) {
                this.shiftPrevItem(this.data[i]);
            //}
            //else {
            //    this.addItemPrev(this.data[i]);
            //}
        }
    }

    /**
     *
     * @param handler
     * @returns {(evt:any)=>undefined}
     */
    private createScrollEventHandler(handler:(evt:any) => void) {

        Log.d(this, "createScrollEventHandler", false, {tag: "handler", value: handler});
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

        let t = document.createTextNode(data);
        let new_elem:HTMLElement = <HTMLElement>this.template_item.cloneNode(true);

        //new_elem.appendChild(t);
        new_elem.innerHTML = data;

        return new_elem;
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