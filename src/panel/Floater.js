Ext.namespace('AOL.panel');

/***
* @class AOL.panel.Floater
* @extends Ext.Panel
* A Panel that will float with the scroll of the page and can be pinned in place.
* @param {Object} config The config object
* @xtype aol-floater
*/
AOL.panel.Floater = Ext.extend(Ext.Panel, {
    /**
     * @cfg {Boolean} pinned toggle if the panel is pinned.
     */
    pinned: false,
    /**
     * @cfg {Number} buffer the buffer to wait (milliseconds) for scrolling before moving the panel 
     */
    buffer: 50,
    /**
     * @cfg {Float} duration how long (milliseconds) the animation duration should take
     */
    duration: 0.03,
    /**
     * @cfg {Number} floatMargin how far away (in pixels) from the top of the page the panel should stay
     */
    floatMargin: 10,
    /**
     * @cfg {Number} snapDistance how far away (in pixels) from home should the box be before it snaps back into place
     */
    snapDistance: 50,
    /**
     * @cfg {Boolean} preventOverflow prevent the floater panel from moving beyond it's containing element.
     */
    preventOverflow: true,
    // private
    initComponent: function(){
        
        this.setupScrollYPref();
        if (!Ext.isArray(this.tools)) {
            this.tools = [];
        }
        this.tools.push({
            id: 'pin',
            handler: function(ev,el,panel){
                this.pinned = !this.pinned;
                el[(this.pinned)?'addClass':'removeClass']('on');
            },
            scope: this
        });
        
        Ext.apply(this, {
            style: 'position: relative; z-index: 3000;',
            startPos: [0, 0]
        });
        
        AOL.panel.Floater.superclass.initComponent.call(this);
        
        if (this.buffer > 0) {
            Ext.EventManager.on(window, 'scroll', this.onPageScroll, this, {
                buffer: this.buffer
            });
        }else{
            Ext.EventManager.on(window, 'scroll', this.onPageScroll, this);
        }
        
    },
    onPageScroll: function(){
        var scrollY = this.scrollObj[this.scrollProp], goingDown = (this.lastY < scrollY) ? false : true;
        if (!this.startPos[1]){
            this.startPos = this.getEl().getXY();
        }
        if (this.el && this.rendered && !this.pinned) {
            if (this.preventOverflow) {
                var ctHeight = this.ownerCt.getHeight(), ctTop = this.ownerCt.getPosition()[1], meHeight = this.getHeight();
                if ((scrollY - ctTop) + meHeight > ctHeight) {
                    this.el.setY(ctHeight + ctTop - meHeight);
                    return this;
                }
            }
            if (this.top && goingDown && scrollY < this.top + this.snapDistance) {
                this.el.setY(this.top);
            } else {
                if (!this.top) {
                    this.top = this.el.getTop();
                    this.el.sequenceFx();
                }
                if (scrollY > this.top) {
                    if (this.buffer === 0) {
                        this.el.dom.style.top = ((scrollY + this.floatMargin) - this.startPos[1]) + 'px'
                    } else {
                        this.el.shift({
                            y: scrollY + this.floatMargin,
                            easing: 'easeNone',
                            duration: this.duration,
                            concurrent: false
                        });
                    }
                }
            }
        }
        this.lastY = scrollY;
    },
    setupScrollYPref : function() {
        var scrollObj = window, scrollProp = 'scrollY';
        if( typeof window.pageYOffset == 'number') {
            scrollObj = window;
            scrollProp = 'pageYOffset'
        }else if(document.documentElement && typeof document.documentElement.scrollTop == 'number') {
            scrollObj = document.documentElement;
            scrollProp = 'scrollTop';
        }else if( document.body && typeof document.body.scrollTop == 'number') {
            scrollObj = document.body;
            scrollProp = 'scrollTop';
        }
        this.scrollObj = scrollObj;
        this.scrollProp = scrollProp;
    },
    destroy: function(){
        Ext.EventManager.un(window, 'scroll', this.onPageScroll);
        AOL.panel.Floater.superclass.destroy.call(this);
    }
});

Ext.reg('aol-floater', AOL.panel.Floater);