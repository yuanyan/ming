// Require.js allows us to configure shortcut alias
require.config({
	paths: {
        $ : '$',
		jquery : '../../../lib/jquery/jquery-1.8.3'
		//text: 'lib/require/text'
	}
});

require([
	'app'
], function( App ) {
    App.init();
});
