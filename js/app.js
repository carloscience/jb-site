require.config({
  baseUrl: 'js',
  // Ensure that RequireJS knows where to find your dependencies.
  paths: {
    jquery: "jquery",
    backbone: "backbone",
    underscore: "underscore",
    layoutmanager: "backbone.layoutmanager",
    main: 'main'
  },

  // Help RequireJS load Backbone.
  shim: {
    'backbone': {
      deps: ["jquery", "underscore"],
      exports: "Backbone"
    },
    'layoutmanager': {
      deps: ['backbone'],
      exports: "Backbone.Layoutanager"
    },
    'main': {
        deps: ['backbone'],
        exports: "main"
    }//,
    /*'foo': {
        deps: ['bar'],
        exports: 'Foo',
        init: function(bar) {
          return this.Foo.noConflict();
        }
    }*/
  }
});

define(['jquery', 'underscore', 'backbone', 'layoutmanager', 'main'], function() {

});
