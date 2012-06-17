/*jshint browser: true, jquery:true, devel: true, undef:true */
/*global  */

var Deck = new Slidedeck();

$(init);

function init() {
    var TICK_PERIOD = 1 * 1000,
        DATA_CHECK_TICKS_INTERVAL = 100, //check for new data interval 
        ticks = 0;
    
    console.log("starting ticker...");
    
    Deck.getPlugins().forEach(function(x) {
        x.init();
    });
    
    // ye olde traditional mainloop
    setInterval(
        function mainLoop() {            
            //console.log("tick"+ticks);    
            checkForData();
            Deck.show(ticks);
            ticks++;
        }, TICK_PERIOD);
        
    function checkForData() {
        //console.debug("check for new data");
        if (ticks % DATA_CHECK_TICKS_INTERVAL === 0) {
            Deck.getPlugins().forEach(function(x) {
                x.poll();
            }); 
        }
    }
}


function Slidedeck() {
    var slides = [],
        // plugins in external JS file will add themselves
        plugins = [],
        slideCounter = 0,
        nextSlideTick = 0;
    
    this.show = function(tick) {
        //console.log("show"+tick); 
        if (tick >= nextSlideTick) {
            slideCounter = (slideCounter < (slides.length - 1)) ? slideCounter+1 : 0;
            showNextSlide();
            nextSlideTick = tick + slides[slideCounter].duration;
            console.debug("dur:"+nextSlideTick);
        }
    };
    
    this.registerPlugin = function(PluginCons) {
        var plugin = new PluginCons();
        if (Slidedeck.validatePlugin(plugin)) {
            plugins.push(plugin);
        } else {
            console.error("Invalid Plugin: "+PluginCons.name);
        }
    };        
    
    this.getPlugins = function(plugin) {
        return plugins;
    };        
    
    this.append = function(duration, slideDOM) {
        console.debug("add slide:"+slideDOM);
        slides.push( { "duration" : duration, "dom" : slideDOM } );        
    };
    
    function showNextSlide() {
        $(".slide_display").empty().append(slides[slideCounter].dom);
    }
}

/**
 * Valid plugins MUST implement the following Inteface:
 * 
 * function init()
 * function poll() 
 */
Slidedeck.validatePlugin = function(p) {
    return ((typeof p != 'undefined') && Slidedeck.isAFunction(p.init) && Slidedeck.isAFunction(p.poll));
};
    
Slidedeck.isAFunction = function(f) {
    return ((typeof f != 'undefined') && (f instanceof Function)); 
};
