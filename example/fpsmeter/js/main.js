require.config({
    paths:{
        $:'../../../src/jquery',
        jquery:'../../../lib/jquery/jquery'
    }
});

require([
    '$','../../../src/fpsmeter/fpsmeter'
], function ($, FPSMeter) {
    var $frame = $('#example');

    // FPSMeters
    FPSMeter.defaults.top = 0;
    FPSMeter.defaults.left = 'auto';
    FPSMeter.defaults.heat = 1;
    FPSMeter.defaults.graph = 1;
    var meters = [
        new FPSMeter($frame[0], {
            right: '50%',
            margin: '0 30px 0 0'
        }),
        new FPSMeter($frame[0], {
            right: '50%',
            margin: '0 200px 0 0',
            theme: 'light'
        }),
        new FPSMeter($frame[0], {
            left: '50%',
            margin: '0 0 0 30px',
            theme: 'colorful'
        }),
        new FPSMeter($frame[0], {
            left: '50%',
            margin: '0 0 0 200px',
            theme: 'transparent'
        })
    ];

    // Simulated FPS
    var frameID;
    function tick() {
        frameID = setTimeout(tick, Math.max(Math.sin(+new Date() * 0.0015) * 50 + 50, 16));
        meters[0].tick();
        meters[1].tick();
        meters[2].tick();
        meters[3].tick();
    }

    tick();

});
