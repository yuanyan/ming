// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		'handlebars': {
			exports: 'Handlebars'
		}
	},
	paths: {
        $ : '$',
		jquery : '../../../lib/jquery/jquery-1.8.3',
		//jquery : 'lib/jquery/jquery.min',
		handlebars: 'lib/handlebars/handlebars.min'
		//text: 'lib/require/text'
	}
});

require([
	'app'
], function( App ) {
    App.init();
});
