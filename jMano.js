class jMano extends Array {
    constructor(selector) {
        super()
        if (!selector)
            return

        if (typeof selector != 'string') {
            this.push(selector)
            return;
        }


        const elements = Array.prototype.slice.call(document.querySelectorAll(selector));
        if (elements)
            for (let e = 0; e < elements.length; e++) {
                this.push(elements[e])

            }
    }
    forEach(fn) {
        for (let i = 0; i < this.length; i++) {
            const element = this[i];
            fn(element, i)
        }
    }
    _parseClasseNames(classNames) {
        let classArray = [];
        if (typeof classNames == 'string') {
            classArray = classNames.split(' ').filter((className) => !!className.length)
        }
        if (typeof classNames == 'object' && Array.isArray(classNames)) {
            classArray = classNames.filter((className) => typeof className == 'string' && className.length)
        }

        return classArray;
    }
    setAttribute(attribute, value = '') {
        this.forEach((el) => {
            el.setAttribute(attribute, value)
        })
    }
    append($jM) {
        if (Array.isArray($jM))
            for (let n = 0; n < $jM.length; n++) {
                this.push($jM[n])
            }
    }
    addClass(classNames) {
        const classes = this._parseClasseNames(classNames);
        this.forEach((el) => {
            el.classList.add(...classes)
        })
    }
    removeClass(classNames) {
        const classes = this._parseClasseNames(classNames);
        this.forEach((el) => {
            el.classList.remove(...classes)
        })
    }
    toggleClass(classStr, condition) {
        if (typeof classStr == 'string' && classStr.length) {

            this.forEach((el) => {
                el.classList.toggle(classStr, condition)
            })
        }
    }

    hasClass(classStr) {
        if (typeof classStr == 'string' && classStr.length && this.length) {
            return this[0].classList.contains(classStr);
        }
        return false;
    }

    on(event, cb, options) {
        if (typeof event != 'string' || !event.length || typeof cb != 'function')
            return;

        const events = this._parseClasseNames(event);

        this.forEach((el) => {
            for (let e = 0; e < events.length; e++) {
                const eventStr = events[e];
                if (typeof el['listeners'] == 'undefined')
                    el['listeners'] = []
                el.addEventListener(eventStr, cb, options);
                el['listeners'].push([eventStr, cb, options]);
            }
        })
    }

    off(event) {
        if (typeof event != 'string' || !event.length)
            return;

        this.forEach((el) => {
            if (typeof el['listeners'] != 'undefined') {
                let newListeners = [];
                el['listeners'].forEach((listenerArr) => {
                    if (listenerArr[0] == event) {
                        el.removeEventListener(...listenerArr)
                    } else {
                        newListeners.push(listenerArr)
                    }
                })
                el['listeners'] = newListeners;
            }
        })
    }

    dispatchEvent(event) {
        if (!event)
            return;

        this.forEach((el) => {
            el.dispatchEvent(event)
        })
    }

    checked() {
        let checked = null;
        this.forEach((el) => {
            if (el.checked === true)
                checked = el
        })
        return new jMano(checked);
    }

    uncheck() {
        this.forEach((el) => {
            if (el.checked === true)
                el.checked = false
        })
    }

    get(element) {
        if (element >= 0 && element < this.length) {
            
            return new jMano(this[element])
        }
        return new jMano()
    }

    parent(){
        const ret = new jMano();
        this.forEach((el) => {
            ret.push(el.parentElement)                
        })

        return ret;
    }

    get element() {
        if(!this.length)
            return null;

        if(this.length > 1)
            console.warn('jMano element only retrieves first from collection!')

        return this[0];
    }

    log() {
        console.log(this)
        return this;
    }

}

function $(selector) {
    return new jMano(selector);
}

