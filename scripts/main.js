function Thing(thing) {
  return {
    id:       ko.observable(thing.id),
    name:     ko.observable(thing.name),
    parents:  ko.observableArray(thing.parents  || []),
    children: ko.observableArray(thing.children || []),
    contents: ko.observableArray(thing.contents || []),
    open: function(model, event) {
      var thingUrl = "http://localhost:3000/things/" + model.id() + "?callback=?";

      jQuery.getJSON(thingUrl, function(response) {
        // This stuff should be made recursive and moved out into a function
        var thing = Thing({name: response.name});

        $(response.children).each(function(index, value) {
          thing.children.push(Thing(value));
        });

        page.listing(thing);
        page.preview(thing);
      });
    },
    select: function(model, event) {
      // Perhaps this should be a css or style binding to a selected flag.
      // Makes some sense I guess. You could have multiple things selected.
      $("#children .selected").removeClass("selected");
      $(event.currentTarget).addClass("selected");
      page.preview(model);
    },
  };
};

function Page(page) {
  return {
    listing: ko.observable(page.listing),
    preview: ko.observable(page.preview || page.listing),
    addThing: function(form) {
      var thing = Thing({
        name: $("#new-thing-name", form).val()
      });

      this.listing().children.push(thing);
      thing.select();

      $("#new-thing-name", form).val("");
      $("#new-thing-name", form).focus();
    },
    addContent: function(content) {
      this.content().preview.contents.push(content);
    }
  };
}

jQuery(function() {  

  var potatoes = Thing({
    name: "Potatoes",
    parents: [
      Thing({name: "Vegetable"})
    ],
    children: [
      Thing({name: "Foo"})
    ],
    contents: [
      {text: "<p>Fusce gravida, odio vel tristique viverra, lectus mi placerat massa, ut dictum orci tellus non elit. Sed sagittis felis in tellus pellentesque placerat. Nunc eu diam ante. Cras ac ipsum arcu, nec pulvinar urna. Etiam tincidunt vehicula malesuada. Etiam sit amet ultricies libero. Vestibulum et mattis lectus. Praesent a pretium turpis. Quisque in velit leo, a laoreet neque. Phasellus ac odio nisl, quis elementum est. Duis dignissim tortor ut urna vulputate bibendum. In malesuada lorem ut nunc ultricies sagittis et et leo.</p>" +
             "<p>Suspendisse tincidunt placerat sodales. Mauris nec enim eget nunc consequat dapibus. Integer molestie, purus in lobortis ultrices, orci lorem lobortis dui, quis pulvinar est tellus eget leo. Sed et arcu non purus pulvinar sodales eget pulvinar velit. Integer malesuada porttitor iaculis. Sed risus quam, malesuada et rhoncus ut, rutrum vel risus. Phasellus nisi mauris, semper faucibus venenatis nec, bibendum ut lacus. Phasellus porttitor, magna a aliquam rutrum, elit dui viverra elit, non lacinia nisi risus et mi.</p>"},
      {text: "<p>Nam ut euismod mauris. Nulla facilisi. Morbi nisl dui, laoreet at varius ut, porttitor id quam. Mauris non mauris at lacus elementum ornare. In accumsan metus in nibh tempus sit amet lobortis nibh auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras lectus nibh, pulvinar vitae fringilla et, luctus non urna. Sed et nisi quis tellus dictum malesuada non nec sapien. Nulla facilisi. In hac habitasse platea dictumst. Nulla facilisi.</p>"}
    ]
  });

  var shopping = Thing({
    name: "Shopping",
    children: [
      Thing({name: "Steak"}),
      potatoes,
      Thing({name: "Bread"})
    ]
  });

  var orphansUrl = "http://localhost:3000/orphans.js?callback=?";

  jQuery.getJSON(orphansUrl, function(response) {
    var thing = Thing({name: response.name});

    $(response.children).each(function(index, value) {
      thing.children.push(Thing(value));
    });

    page = Page({
      listing: thing,
      preview: thing
    })

    ko.applyBindings(page);
  });


});

