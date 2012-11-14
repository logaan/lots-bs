function thing(name, parents, children) {
  var parents  = parents  || [];
  var children = children || [];

  return {
    name:     ko.observable(name),
    parents:  ko.observableArray(parents),
    children: ko.observableArray(children)
  };
};

jQuery(function() {  
  ko.applyBindings(
    thing("Shopping", [], [
      thing("Steak"),
      thing("Potatoes", [
        thing("Vegetable")
      ], [
        thing("Foo")
      ]),
      thing("Bread")
    ])
  );
});

