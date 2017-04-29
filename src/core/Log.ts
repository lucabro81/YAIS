interface Function {
    name:string;
}

class Log {

    static is_debug:boolean = false;

    static d(context:IBaseClass, method:Function, ...output:Array<string|any>):void {
        if (Log.is_debug) {
            console.log(context.name, method.name, output);
        }
    }
}