import {LinkedList} from "lucabro-linked-list/package/LinkedList";
import {ListElement} from "lucabro-linked-list/package/ListElement";

// TODO: valutare se passare come generic il tipo di dato che sarà dentro il nodo della lista
class YAIS implements IBaseClass {

    static SCROLL_EVENT:string = "scroll";

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

    constructor(is_debug_enabled:boolean = false) {

        this.enableDebug(is_debug_enabled);

        Log.d(this, null, "constructor");

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
    }

////////////////////////////////////////////////
//////////////////// PUBLIC ////////////////////
////////////////////////////////////////////////

    public init(container:HTMLElement,
                data:Array<any>,
                items_per_page:number,
                loop:boolean = false) {

        Log.d(this, this.init, "initialization");

        this.data = data;
        this.items_per_page = items_per_page;
        this.pages = 1;
        this.length = this.items_per_page;
        this.is_loop = loop;
        this.outer_container = container;

        this.initContainer(this.outer_container);
        this.initList();
        this.initDefaultItemElem();
        this.onScrollListener();

        // TODO: validazione elementi input (container, data, items_per_page, obbligatori)
    }

    public scrollListenerEnabled() {
        this.is_scroll_enabled = true;
    }

    public scrollListenerDisabled() {
        this.is_scroll_enabled = false;
    }

    public onScrollListener(handler:(evt:any) => void = null): void {

        if (this.on_scroll_event_handler !== null) {
            this.outer_container.removeEventListener(YAIS.SCROLL_EVENT, this.on_scroll_event_handler);
        }

        this.on_scroll_event_handler = this.createScrollEventHandler(handler);

        // TODO: non sono sicuro dello scope, controllare
        this.outer_container.addEventListener(YAIS.SCROLL_EVENT, this.on_scroll_event_handler);
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

    public addItemPrev() {

    }

    public addItemNext() {

    }

    public addPagPrev() {

    }

    public addPagNext() {

    }

    public shiftNextItem() {

    }

    public shiftPrevItem() {

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
        this.ll.destroy();
        this.outer_container.removeEventListener(YAIS.SCROLL_EVENT, this.on_scroll_event_handler);

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

        /*this.ll = new LinkedList<ListElement>();
        this.ll.init(ListElement);

        for (let i = 0; i < this.items_per_page*3; i++) {
            if (this.data[i]) {
                this.ll.addElem(this.data[i]);
            }
            else {
                break;
            }
        }*/
    }

    /**
     *
     * @param outer_container
     */
    private initContainer(outer_container:HTMLElement) {

        let inner_container_elem:HTMLElement = document.createElement("DIV");

        outer_container.style.overflow = "hidden";
        outer_container.appendChild(inner_container_elem);

        this.container = inner_container_elem;
    }

    /**
     *
     * @param evt
     */
    private onScrollEventDefaultHandler(evt:any) {
        if (this.outer_container.scrollTop > this.previous_scroll_value) {
            if (((this.outer_container.scrollTop) > this.current_elem_height - 600) && (this.is_scroll_avaible)) {

                this.is_scroll_avaible = false;
                for (let i = this.items_per_page * this.current_page;
                     i < this.items_per_page * (this.current_page + 1);
                     i++) {

                    /*
                    function detach(node, async, fn) {
                        var parent = node.parentNode;
                        var next = node.nextSibling;
                        // No parent node? Abort!
                        if (!parent) { return; }
                        // Detach node from DOM.
                        parent.removeChild(node);
                        // Handle case where optional `async` argument is omitted.
                        if (typeof async !== "boolean") {
                            fn = async;
                            async = false;
                        }
                        // Note that if a function wasn't passed, the node won't be re-attached!
                        if (fn && async) {
                            // If async == true, reattach must be called manually.
                            fn.call(node, reattach);
                        } else if (fn) {
                            // If async != true, reattach will happen automatically.
                            fn.call(node);
                            reattach();
                        }
                        // Re-attach node to DOM.
                        function reattach() {
                            parent.insertBefore(node, next);
                        }
                    }



                     // Get an element.
                     var elem = document.getElementById('huge-ass-table');

                     // Just detach element from the DOM.
                     detach(elem);

                     // Detach + exec fn + reattach, synchronous.
                     detach(elem, function() {
                     // this == elem, do stuff here.
                     });

                     // Detach + exec fn + reattach, asynchronous.
                     detach(elem, true, function(reattach) {
                     // this == elem, do stuff here, call reattach() when done!
                     setTimeout(reattach, 1000);
                     });
                     */

                    let new_elem:HTMLElement = app.createElem(data_source[i], false);

                    if (this.current_page > 2) {
                        app.removeElem(this.ll.start.data);
                        this.ll.shiftLeft().end.data = new_elem;
                    }
                    else {
                        this.ll.addElem(new_elem);
                    }
                }
                this.current_page++;

                this.current_elem_height = this.container.offsetHeight;

                this.is_scroll_avaible = true;
            }
        }
        else if (this.outer_container.scrollTop < this.previous_scroll_value) {

        }

        this.previous_scroll_value = this.outer_container.scrollTop;
    }

    /**
     *
     * @param handler
     * @returns {(evt:any)=>undefined}
     */
    private createScrollEventHandler(handler:(evt:any) => void) {

        this.handler = handler;

        return (evt:any):void => {
            if (this.handler === null && this.is_scroll_enabled) {
                this.onScrollEventDefaultHandler(evt);
            }
            else if (this.is_scroll_enabled) {
                this.handler(evt);
            }
        };

        /*if (handler === null) {
            return (evt:any):void => {
                if (this.is_scroll_enabled) {
                    this.onScrollEventDefaultHandler(evt);
                }
            }
        }
        else {
            return (evt:any):void => {
                if (this.is_scroll_enabled) {
                    handler(evt);
                }
            }
        }*/
    }

    /**
     *
     */
    private initDefaultItemElem():void {
        let template = document.createElement('template');
        template.innerHTML = "<div></div>";
        this.template_item = template.content.firstChild;
    }

} export {YAIS};