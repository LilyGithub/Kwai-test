class Bus {
    //存所有注册的监听
    private readonly _listeners: any;
    constructor() {
        this._listeners = {};
    }

    /**
     * 注册事件监听
     * @param eventName 事件名称
     * @param callback 注册事件回调
     */
    listen(eventName: string, callback: Function): void {
        if (Array.isArray(eventName)) {
            eventName.forEach(evt => {
                this.listen(evt, callback);
            });
        } else {
            this._addLisen(eventName, callback);
        }
    }
    /**
     * 注销监听
     * @param eventName 事件名称
     * @param callback 事件回调
     */
    unListen(eventName: string, callback: Function): void {
        if (Array.isArray(eventName)) {
            eventName.forEach(evt => {
                this.unListen(evt, callback);
            });
        }
        //没有第二参素代表清空事件所有监听
        if (!callback) {
            this._listeners[eventName] = [];
        } else {
            const listens = this._getLisensByEvent(eventName);
            for (let i = 0; i < listens?.length; i++) {
                const cb = listens[i];
                if (cb === callback) {
                    listens.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * 触发某事件
     * @param eventName 事件名称
     */
    trigger(eventName: string, ...params: any) {
        let listens = this._getLisensByEvent(eventName);
        for (let i = 0, l = listens?.length; i < l; i++) {
            try {
                listens[i].apply(null, [...arguments].slice(1));
            } catch (err) {
                new Error(`${eventName}事件执行异常：${err}`);
            }
        }
    }
    /**
     * 获取事件的所有监听
     * @param eventName 事件名称
     */
    private _getLisensByEvent(eventName: string): Array<Function> {
        return this._listeners[eventName] || [];
    }
    /**
     * 添加事件监听
     * @param eventName 事件名称
     */
    private _addLisen(eventName: string, callback: Function): void {
        (this._listeners[eventName] || (this._listeners[eventName] = [])).push(callback);
    }
}

const bus = new Bus();
bus.listen('event1', (params: any, params2: any) => console.log('event1-listen1', params, params2));
bus.listen('event1', (params: any, params2: any) => console.log('event1-listen2', params, params2));
bus.listen('event1', (params: any, params2: any) => {
    console.log('event1-listen3', params, params2);
    bus.trigger('event2', params, params2);
});
bus.listen('event2', (params: any, params2: any) => console.log('event2-listen1', params, params2));
bus.listen('event2', (params: any, params2: any) => console.log('event2-listen2', params, params2));
bus.trigger('event1', 'params', 'params2');


//用时30分钟