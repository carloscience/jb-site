var JB = JB || {};
var JST = JST || {};

JB.Model = Backbone.Model.extend({});
JB.model = new JB.Model();

Backbone.Layout.configure({
	manage: true,

  // where are the HTML templates:
  prefix: "templates/",

  fetchTemplate: function(path) {
    console.log('fetch:', arguments);
    // Concatenate the file extension.
    path = path + ".html";

    // If cached, use the compiled template.
    if (JST[path]) {
      return JST[path];
    }

    // Put fetch into `async-mode`.
    var done = this.async();

    // Seek out the template asynchronously.
    $.get(path, function(contents) {
      done(_.template(contents));
    }, "text");
  }
});

JB.Router = Backbone.Router.extend({
	routes: {
    '': 'index'
	},
	index: function() {
		console.log('got index');
	},
	showCv: function() {
		console.log("getting cv data");

		$.getJSON('data/cv.json', function(result) {
      		console.log(result);
      		for (item in result.education) {
        		var data = result.education[item];
        		$('.education ul').append('<li>' + data.date + ' ' + data.degree + ', ' + data.university + ', ' + data.city + ', ' + data.state + '</li>');
      		}
      		for (item in result.solo) {
        		var data = result.solo[item];
        		if (data.gallery) {
          			var exhibitions = '<li>' + data.date + ' ' + data.title + ', ' + data.gallery + ', ' + data.city + ', ' + data.state + '</li>';
        		} else {
          			var exhibitions = '<li>' + data.date + ' ' + data.title + ', ' + data.city + ', ' + data.state + '</li>';
        		}
        		$('.solo ul').append(exhibitions);
      		}
      		for (item in result.group) {
        		var data = result.group[item];
        		if (data.gallery) {
          			var exhibitions = '<li>' + data.date + ' ' + data.title + ', ' + data.gallery + ', ' + data.city + ', ' + data.state + '</li>';
        		} else {
          			var exhibitions = '<li>' + data.date + ' ' + data.title + ', ' + data.city + ', ' + data.state + '</li>';
        		}
        		$('.group ul').append(exhibitions);
      		}
      		for (item in result.awards) {
        		var data = result.awards[item];
        		if (data.category) {
          			var exhibitions = '<li>' + data.date + ' ' + data.title + ', ' + data.category + ', ' + data.city + ', ' + data.state + '</li>';
        		} else {
          			var exhibitions = '<li>' + data.date + ' ' + data.title + ', ' + data.city + ', ' + data.state + '</li>';
        		}
        		$('.awards ul').append(exhibitions);
      		}
      		for (item in result.publications) {
        		var data = result.publications[item];
        		$('.publications ul').append('<li>' + data.date + ', ' + data.title + '</li>');
      		}
    	});
	}
});

$(document).ready(function() {
  JB.Header = Backbone.Layout.extend({
    template: 'header',
    el: '#header',
    events: {
      'click a.home': 'onHome',
      'click a.work': 'onWork',
      'click a.cv': 'onCv',
      'click a.contact': 'onContact',
    },
    initialize: function() {
      console.log('header initialize');
      console.log(this.$el.html());
      this.render();
    },
    onHome: function(e) {
      e.preventDefault();
      console.log('clicked home');
      JB.home.render();
    },
    onWork: function(e) {
      e.preventDefault();
      console.log('clicked work');
      /*var $a = $(e.currentTarget);
      var index = this.$el.find('a').index($a);
      console.log(index);*/
      JB.work.render();
    },
    onCv: function(e) {
      e.preventDefault();
      JB.cv.render();
      JB.router.showCv(); 
    },
    onContact: function(e) {
      e.preventDefault();
      JB.contact.render();
    },
    serialize: function() {
      console.log('serializing');
    //return { user: this.model };
    }
  });

  JB.Home = Backbone.Layout.extend({
    template: 'home',
    el: '#populate',
    initialize: function(){
      console.log('home initialized');
      this.render();
    }
  });

  JB.Work = Backbone.Layout.extend({
    template: 'work',
    el: '#populate',
    initialize: function(){
        console.log('work initialized');
        //this.render();
    }
  });
  
  JB.Contact = Backbone.Layout.extend({
    template: 'contact',
    el: '#populate',
    initialize: function() {
      console.log('contact initialized');
    }
  });

  JB.Cv = Backbone.Layout.extend({
    template: 'cv',
    el: '#populate',
    initialize: function() {
      console.log('cv initialized');
    }
  });
  JB.home = new JB.Home();
  JB.router = new JB.Router();
  JB.header = new JB.Header();
  JB.work = new JB.Work();
  JB.contact = new JB.Contact();
  JB.cv = new JB.Cv();

  Backbone.history.start();
  //jQuery.noConflict();
  /*$('#nav a').click(function(e) {
    e.preventDefault();
    console.log('clicked nav');
    $(this).addClass('selected');
  });*/
	
    /*$('#nav li').hover(
        function () {
            //show its submenu
            $('ul', this).slideDown(100);
 
        },
        function () {
            //hide its submenu
            $('ul', this).slideUp(100);        
        }
    );
    $(".lnksection").mouseover(function () {
        $("#dropdown").show();
    });*/
});