var LolApi = function (messageName, payloadObj) {
    parent.parent.postMessage({
        message: messageName,
        payload: JSON.stringify(payloadObj)
    },
'*')
console.log("API message sent: " + messageName)};

var InitializeLoL = function () {
    LolApi("init", {
        aspectRatio: "256:165",
        resolution: "1024x660",
        sdkVersion: "5.2"}
    );
}

var currentMoney;
var highestMoney;
var lolProgress = 0;
var lolMaxProgress = 16;


var incrementProgress = function(){
    lolProgress+=1;
    ReportProgress(lolProgress, gg.money);
}
var ReportProgress = function(progress, currentScore){
    console.log("current progress: " + progress);
    if (currentScore > highestMoney) {highestMoney = currentScore};

    LolApi("progress", {
        currentProgress: progress,
        maximumProgress: lolMaxProgress,
        score: highestMoney
    });

    if (progress >= lolMaxProgress){
        LolApi("complete", {});
    }
}

var lolSave = function(progress){
    for(var i = 0; i < gg.b.tiles.length; i++){
      gg.b.stamp_nutrition[i] = gg.b.tiles[i].nutrition;
    }

    LolApi("saveState", { currentProgress: progress, maximumProgress: lolMaxProgress, data:
    {
    money: gg.money,
    n_farmbits: gg.farmbits.length,
    og_types: gg.b.og_types,
    stamp_nutrition: gg.b.stamp_nutrition,
    structure_deltas: gg.b.structure_deltas,
    }});
}

const EVENT = {
    RECEIVED: {
        PAUSE: 'pause',
        RESUME: 'resume',
        QUESTIONS: 'questions',
        LANGUAGE: 'language',
        START: 'start',
        INIT: 'init',
        STATE: 'loadState'
    }
};

parent.window.addEventListener("message", function (msg) {
    //The parent sent this message repeatedly, spamming the console.
    if (msg.data === "captureReady"){return;}
    console.log("[PARENT => JAVASCRIPT]", msg);

    switch (msg.data.messageName) {
        case EVENT.RECEIVED.PAUSE:
            gg.speed = SPEED_PAUSE;
            console.log("PAUSE");
            break;
        case EVENT.RECEIVED.RESUME:
            gg.speed = SPEED_PLAY;
            console.log("RESUME");
            break;
        case EVENT.RECEIVED.QUESTIONS:
            // QUESTIONS handler here
            break;
        case EVENT.RECEIVED.LANGUAGE:
            // LANGUAGE handler here
            break;
        case EVENT.RECEIVED.START:
            // START handler here
            break;
        case EVENT.RECEIVED.STATE:
            console.log("recieved a load call");
            
            const previousState = JSON.parse(payload);
            const currentProgress = previousState && previousState.currentProgress;
            ReportProgress(currentProgress, payload.data.money);
            gg.money = payload.data.money;
            gg.farmbits.length = payload.data.n_farmbits;
            gg.b.og_types = payload.data.og_types;
            gg.b.stamp_nutrition = payload.data.stamp_nutrition;
            gg.b.structure_deltas = payload.data.structure_deltas;

            // The following is copied directly from Lakeland's included load function in src/gg.b.js
            //set raw info
            for(var i = 0; i < gg.b.tiles.length; i++)
            {
            gg.b.tiles[i].og_type = gg.b.og_types[i];
            gg.b.tiles[i].type = gg.b.og_types[i];
            gg.b.tiles[i].nutrition = gg.b.stamp_nutrition[i];
            }

            //shoreline
            for(var i = 0; i < gg.b.tile_groups[TILE_TYPE_SHORE].length; i++)
            {
            var shore_d = 2;
            var t = gg.b.tile_groups[TILE_TYPE_SHORE][i];
            var st;
            for(var xd = -shore_d; xd <= shore_d; xd++)
                for(var yd = -shore_d; yd <= shore_d; yd++)
                {
                st = gg.b.tiles_t(clamp(0,gg.b.tw-1,t.tx+xd),clamp(0,gg.b.th-1,t.ty+yd));
                var d = xd*xd+yd*yd;
                if(st.type == TILE_TYPE_LAND) st.shoreline = 1;
                }
            }

            //apply deltas
            for(var i = 0; i < gg.b.structure_deltas.length; i++)
            {
            var t = gg.b.tiles_t(gg.b.structure_deltas[i].tx,gg.b.structure_deltas[i].ty);
            t.type = gg.b.structure_deltas[i].type;
            t.state = TILE_STATE_NULL;
            t.val = 0;
            t.state_t = 0;
            switch(t.type)
            {
                case TILE_TYPE_HOME:
                t.state = TILE_STATE_HOME_VACANT;
                gg.b.own_tiles(t,2);
                break;
                case TILE_TYPE_FARM:
                t.state = TILE_STATE_FARM_UNPLANTED;
                gg.b.own_tiles(t,2);
                break;
                case TILE_TYPE_LIVESTOCK:
                t.state = TILE_STATE_LIVESTOCK_EATING;
                t.marks[0] = MARK_SELL;
                gg.b.own_tiles(t,2);
                break;
            }
            }

            //move in bits
            for(var i = 0; i < ls.n_farmbits; i++)
            {
            if(gg.farmbits.length == gg.b.bounds_n) { gg.b.inc_bounds(); gg.b.bounds_n++; gg.b.resize(); }
            var t = gg.b.tiles_t(gg.b.bounds_tx+randIntBelow(gg.b.bounds_tw),gg.b.bounds_ty+randIntBelow(gg.b.bounds_th));
            var b = new farmbit();
            b.fullness = max_fullness;
            b.tile = t;
            gg.b.tiles_tw(t,b);
            gg.farmbits.push(b);
            my_logger.new_farmbit(b);
            job_for_b(b);
            b.home = closest_unlocked_state_tile_from_list(b.tile, TILE_STATE_HOME_VACANT, gg.b.tile_groups[TILE_TYPE_HOME]);
            if(b.home) b.home.state = TILE_STATE_HOME_OCCUPIED;
            }

            //group tiles
            for(var i = 0; i < TILE_TYPE_COUNT; i++)
            gg.b.tile_groups[i] = [];
            for(var i = 0; i < gg.b.tiles.length; i++)
            {
            var t = gg.b.tiles[i];
            gg.b.tile_groups[t.type].push(t);
            }

            gg.b.center_tile = gg.b.tiles_t(floor(gg.b.tw/2),floor(gg.b.th/2));

            //find sheds
            for(var i = 0; i < gg.b.tiles.length; i++)
            {
            var t = gg.b.tiles[i];
            if(t.type == TILE_TYPE_LAKE) continue;
            var closest_d = max_dist;
            var d;
            var tt;
            for(var ti = 0; ti < gg.b.tiles.length; ti++)
            {
                var tt = gg.b.tiles[ti];
                if(tt.type != TILE_TYPE_LAKE) continue;
                d = distsqr(t.tx,t.ty,tt.tx,tt.ty);
                if(d < closest_d)
                {
                closest_d = d;
                t.shed = tt;
                t.shed_d = floor(d);
                }
            }
            var xdir = 0;
            var ydir = 0;
            if(t.shed.tx < t.tx) xdir = -1;
            if(t.shed.tx > t.tx) xdir =  1;
            if(t.shed.ty < t.ty) ydir = -1;
            if(t.shed.ty > t.ty) ydir =  1;
            if(xdir == 0 && rand() < 0.8) xdir = randIntBelow(3)-1;
            if(ydir == 0 && rand() < 0.8) ydir = randIntBelow(3)-1;
            if(xdir ==  1 && t.tx == gg.b.tw-1) xdir = 0;
            if(xdir == -1 && t.tx == 0)         xdir = 0;
            if(ydir ==  1 && t.ty == gg.b.th-1) ydir = 0;
            if(ydir == -1 && t.ty == 0)         ydir = 0;
            t.shed = gg.b.tiles[t.i+xdir+ydir*gg.b.tw];
            }
            break;
        case EVENT.RECEIVED.INIT:
            break;
        default:
               console.log('Unhandled message: ' + msg);
    }
});
