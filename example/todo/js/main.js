// Require.js allows us to configure shortcut alias
require.config({
    paths:{
        $:'../../../src/jquery',
        jquery:'../../../lib/jquery/jquery'
        //text: 'lib/require/text'
    }
});

require([
    'app'
], function (App) {
    App.init();
});
