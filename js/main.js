var JB = JB || {}; // main app object
var JST = JST || {};

JB.data = {};

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

JB.EducationModel = Backbone.Model.extend({});
JB.SoloModel = Backbone.Model.extend({});
JB.GroupModel = Backbone.Model.extend({});
JB.AwardModel = Backbone.Model.extend({});
JB.PublicationModel = Backbone.Model.extend({});
JB.educationModel = new JB.EducationModel();
JB.soloModel = new JB.SoloModel();
JB.groupModel = new JB.GroupModel();
JB.awardModel = new JB.AwardModel();

// Backbone router for nav links
JB.Router = Backbone.Router.extend({
  routes: {
    '': 'index',
    'index': 'index',
    'work': 'showWork',
    'portrait': 'showPortrait',
    'cv': 'showCv',
    'contact': 'showContact'
  },
  index: function() {
    console.log('got index');
    // render home page
    JB.home.render();
  },

  showWork: function() {
    // render work template
    JB.work.render();
    $.getJSON('data/work.json', function(data) {
      $.extend(JB.data, data);
      var val = 'cowboy';
      model = data[val];
      JB.cowboyView = new JB.CowboyView({data: model});
    });
  },

  showPortrait: function() {
    // render portrait template
    JB.portrait.render();
    $.getJSON('data/work.json', function(data) {
      $.extend(JB.data, data);
      var val = 'portrait';
      model = data[val];
      JB.portraitView = new JB.PortraitView({data: model});
    });
  },

  showCv: function() {
    // render CV template
    JB.cv.render();
    console.log("getting cv data");

    $.getJSON('data/cv.json', function(data) {
          $.extend(JB.data, data);
        
          var education = 'education',
            solo = 'solo',
            group = 'group',
            awards = 'awards',
            publications = 'publications';

          JB.educationModel = data[education];
          JB.soloModel = data[solo];
          JB.groupModel = data[group];
          JB.awardModel = data[awards];
          JB.publicationModel = data[publications];
          //JB.cv.setView('education', new JB.EducationView({data: }));
          JB.educationView = new JB.EducationView({data: JB.educationModel});
          
          //JB.cv.setView('solo', new JB.SoloView({data: JB.soloModel}));
          JB.soloView = new JB.SoloView({data: JB.soloModel});
          
          JB.groupView = new JB.GroupView({data: JB.groupModel});
          
          JB.awardView = new JB.AwardView({data: JB.awardModel});
         
          JB.publicationView = new JB.PublicationView({data: JB.publicationModel});
    });
  },

  // render contact page and route there
  showContact: function() {
    JB.contact.render();
  }
});

$(document).ready(function() {

  JB.Header = Backbone.Layout.extend({
    template: 'header', // load header template
    el: '#header',
    events: {
      'mouseover .listWork': 'listWork', // pulldown menu under work nav
      'mouseleave .listWork': 'hideWork',
      'mouseleave .showPaintings': 'hideWork'
    },
    initialize: function() {
      console.log('header initialize');
      console.log(this.$el.html());
      this.render(); // render header
    },
    
    listWork: function() {
      console.log('activate dropdown menu');
      $('.showPaintings').slideDown(100);
    },
    hideWork: function() {
      $('.showPaintings').slideUp(100);
    }
  });

  JB.Home = Backbone.Layout.extend({
    template: 'home', // load home template
    el: '#populate',
    initialize: function(){
      console.log('home initialized');
    }
  });

  JB.Work = Backbone.Layout.extend({
    template: 'work', // load work template
    el: '#populate',
    initialize: function(){
        console.log('work initialized');
        console.log('work el is ' + this.el);
    }
  });
  
  JB.Contact = Backbone.Layout.extend({
    template: 'contact', // load contact template
    el: '#populate',
    initialize: function() {
      console.log('contact initialized');
    }
  });

  JB.Cv = Backbone.Layout.extend({
    template: 'cv', // load cv template
    el: '#populate',
    initialize: function() {
      console.log('cv initialized');
    }
  });

  JB.Portrait = Backbone.Layout.extend({
    template: 'portrait', // load portrait template
    el: '#populate',
    initialize: function() {
      console.log('portrait initialized');
    }
  });

  JB.CowboyView = Backbone.Layout.extend({
    template: 'cowboy',
    el: '#load_work',
    initialize: function() {
      console.log("el is " + this.$el.attr('id'));
      this.render();
    }
  });

  JB.PortraitView = Backbone.Layout.extend({
    template: 'otherworks',
    el: '#load_work',
    initialize: function() {
      this.render();
    }
  });

  JB.EducationView = Backbone.Layout.extend({
    template: 'education',
    el: '.education_list',
    initialize: function() {
      this.render();
    }
  });

  JB.SoloView = Backbone.Layout.extend({
    template: 'solo',
    el: '.solo_list',
    initialize: function() {
      this.render();
    }
  });

  JB.GroupView = Backbone.Layout.extend({
    template: 'group',
    el: '.group_list',
    initialize: function() {
      this.render();
    }
  });

  JB.AwardView = Backbone.Layout.extend({
    template: 'awards',
    el: '.award_list',
    initialize: function() {
      this.render();
    }
  });

  JB.PublicationView = Backbone.Layout.extend({
    template: 'publications',
    el: '.publication_list',
    initialize: function() {
      this.render();
    }
  });

  // instantiate Layouts and Router
  JB.home = new JB.Home();
  JB.router = new JB.Router();
  JB.header = new JB.Header();
  JB.work = new JB.Work();
  JB.contact = new JB.Contact();
  JB.cv = new JB.Cv();
  JB.portrait = new JB.Portrait();

  // start router
  Backbone.history.start();
  
});