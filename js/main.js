var JB = JB || {}; // main app object
var JST = JST || {};

// configure backbone layouts
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

// Backbone router for nav links
JB.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'work': 'showWork',
    'portrait': 'showWork',
    'cv': 'showCv',
    'contact': 'showContact'
  },
  index: function() {
    console.log('got index');
    // render home page
    JB.home.render();
  },

  showWork: function(lnk) {
    // page is loaded by deep linking. no current target
    if (!(lnk)) {
      var deeplink = window.location.hash.substring(1);
      lnk = deeplink;
      console.log("link is " + lnk);
    }

    // main work link was clicked or cowboy paintings link was clicked
    if (lnk == "work" || lnk == "worktitle") {
      JB.work.render(); // render main work page
      this.navigate('work'); // route to work page
    }
    // portrait link under work dropdown was clicked
    if (lnk == "portrait" || lnk == "worktitle2") {
      JB.portrait.render(); // render portrait page
      this.navigate('portrait'); // route to portrait page
    }
    console.log("getting work data");
    // get list of work
    $.getJSON('data/work.json', function(result) {
      
      var category,
       light;
       
      if (lnk == "work" || lnk == "worktitle") {
        category = result.cowboy;
        light = "cowboy";
      }
      if (lnk == "portrait" || lnk == "worktitle2") {
        category = result.portrait;
        light = "grpth";
      }
      for (item in category) {
        var data = category[item];
        $('#load_work').append('<div class="image_cell"><a href="' + data.href + '" rel="lightbox[' + light + ']" title="' + data.title + '"><img src="' + data.src + '" alt="' + data.alt + '" border="0" /></a></div>');
      }
    });
  },

  showCv: function() {
    JB.cv.render();
    this.navigate('cv');
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
  },

  showContact: function() {
    JB.contact.render();
    this.navigate('contact');
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
      'click a.portrait': 'onPortrait',
      'click a.worktitle2': 'onPortrait',
      'click a.worktitle': 'onWork',
      'mouseover .listWork': 'listWork',
      'mouseleave .listWork': 'hideWork',
      'mouseleave .showPaintings': 'hideWork'
    },
    initialize: function() {
      console.log('header initialize');
      console.log(this.$el.html());
      this.render();
    },
    onHome: function(e) {
      e.preventDefault();
      console.log('clicked home');
      JB.router.index();
    },
    onWork: function(e) {
      e.preventDefault();
      console.log('clicked work');
      var $a = $(e.currentTarget).attr('class');;
      console.log('current link is ' +  $a)
      JB.router.showWork($a);
    },
    onCv: function(e) {
      e.preventDefault();
      JB.router.showCv(); 
    },
    onContact: function(e) {
      e.preventDefault();
      JB.router.showContact();
    },
    onPortrait: function(e) {
      e.preventDefault();
      var $a = $(e.currentTarget).attr('class');
      console.log('current link is ' +  $a)
      JB.router.showWork($a);
    },
    listWork: function() {
      console.log('activate dropdown menu');
      $('.showPaintings').slideDown(100);
    },
    hideWork: function() {
      $('.showPaintings').slideUp(100);
    },
    serialize: function() {
      console.log('serializing');
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
    events: {
      'click a.worktitle2': 'subPortrait'
    },
    subPortrait: function(e) {
      e.preventDefault();
      JB.header.onPortrait(e);
    },
    initialize: function(){
        console.log('work initialized');
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

  JB.Portrait = Backbone.Layout.extend({
    template: 'portrait',
    el: '#populate',
    events: {
      'click a.worktitle': 'subWork'
    },
    subWork: function(e) {
      e.preventDefault();
      JB.header.onWork(e);
    },
    initialize: function() {
      console.log('portrait initialized');
    }
  });

  JB.home = new JB.Home();
  JB.router = new JB.Router();
  JB.header = new JB.Header();
  JB.work = new JB.Work();
  JB.contact = new JB.Contact();
  JB.cv = new JB.Cv();
  JB.portrait = new JB.Portrait();

  Backbone.history.start();
  //jQuery.noConflict();
  
});