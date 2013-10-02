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

JB.AppModel = Backbone.Model.extend({
  defaults: {
    'href': 'href',
    'title': 'title',
    'src': 'src',
    'alt': 'alt'
  }
});

JB.Works = Backbone.Collection.extend({
  model: JB.AppModel,
  url: '/artist-portfolio/data/work.json',
  parse: function(response) {
    for (data in response.cowboy) {
      console.log(response.cowboy[data]);
      //this.set({model: response.cowboy[data]})
    }
    console.log('response is ' + response.cowboy);
    return response.cowboy;
  }
  /*addItems: function(data) {
    console.log("adding to collection " + data);
  }*/
});


//JB.works = new JB.Works();

//console.log('work url is ' + JB.works.url);


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
    
    JB.work.render();
    JB.worksView = new JB.WorksView();
    //JB.worksView.render();
    /*JB.works.fetch(*/
    JB.data = {};

    // get list of work
    /*$.getJSON('data/work.json', function(result) {
      $.extend(JB.data, result);
      console.log('work data ' + result.cowboy);
      JB.works.addItems({model: result.cowboy});
      //JB.working = new JB.Work({model: result});

      /*for (item in result.cowboy) {
        var data = result.cowboy[item];
        $('#load_work').append('<div class="image_cell"><a href="' + data.href + '" rel="lightbox[cowboy]" title="' + data.title + '"><img src="' + data.src + '" alt="' + data.alt + '" border="0" /></a></div>');
      }
    });*/
  },

  showPortrait: function() {
    JB.portrait.render();
    $.getJSON('data/work.json', function(result) {
      
      for (item in result.portrait) {
        var data = result.portrait[item];
        $('#load_work').append('<div class="image_cell"><a href="' + data.href + '" rel="lightbox[grpth]" title="' + data.title + '"><img src="' + data.src + '" alt="' + data.alt + '" border="0" /></a></div>');
      }
    });
  },

  showCv: function() {
    JB.cv.render();
    console.log("getting cv data");

    $.getJSON('data/cv.json', function(result) {
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

  JB.WorksView = Backbone.Layout.extend({
    defaults: {
      works: []
    },
    //template: 'cowboy',
    template: _.template('<% console.log("template test"); %>' + '<% _.each(this.works, function(cb) { %>' + 
      '<div class="image_cell"><a href="<%= cb.get("href") %>" rel="lightbox[cowboy]" title="<%= cb.get("title") %>">' +
      '<img src="<%= cb.get("src") %>" alt="<%= cb.get("alt") %> " border="0" /></a></div><% }); %>'),
    el: '#load_work',
    initialize: function() {
      var works = new JB.Works();
      var hold_model = [];
      works.fetch({
        success: function() {
          console.log("JSON file load was successful", works);
          console.log("models are " + works.models);
          console.log("checking for undefined objects " + this.collection);
          for (model in works.models) {
            console.log("looping through collection " + works.models[model].attributes.title);
            hold_model.push(works.models[model].attributes);
          }
          //var template = _.template(this.template, {works: works.models});
          //this.$el.html(template);  
          //var works_template = _.template(this.template);
          //console.log("works template is " + works_template);
          //var html = works_template();
          //console.log("template is " + html);
          console.log("work length is " + works.toJSON().length);
          console.log("work attributes are " + works.attributes);

          
        },
        error: function(){
          console.log('There was some error in loading and processing the JSON file');
        }
      });
      works.bind('reset', function () { console.log(works); });
      console.log("length is " + works.models.length);
      console.log("after bind works is " + works.models);
      var thiswork = this.work;
      this.$el.html(this.template(works.toJSON()));
      //console.log("now el has " + $(this.el).html(this.template, {collection: JB.Works.models}));
      console.log("el is " + this.$el.attr('id'));
      this.render();
      /*for (work in works) {
        console.log("work is " + work);
      }*/
      /*_.each(works.models[0], function(profile){
        console.log('profile is ' + profile.toJSON());
         var profileTemplate = this.template(profile.toJSON());
         $(this.el).append(profileTemplate);
      }, this);
      return this;*/
      
      //this.$el.html(works_template({collection: works.models[0]}));
      
      //console.log("works template is " + html);
      //console.log('testing cowboy template' + this.$el.html());
     
    //this.collection.bind('reset', this.render, this);
    //
    },
    render: function() {
      //$(this.el).html(this.template(JB.Works.models));
      //$(this.el).html(this.template({ this.collection.toJSON()});
     console.log('rendering cowboy template');
     /* _.each(this.model.models, function(profile){
         var profileTemplate = this.template(profile.toJSON());
         $(this.el).append(profileTemplate);
      }, this);
      return this;*/
      
      return this;
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
  JB.works = new JB.Works({parse: true});

  // start router
  Backbone.history.start();
  
});