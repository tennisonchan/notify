function extend(){
  for(var i=1; i<arguments.length; i++)
    for(var key in arguments[i])
        if(arguments[i].hasOwnProperty(key))
          arguments[0][key] = arguments[i][key];
  return arguments[0];
}

var NotiferCentre = (function(name) {
  var _this = {};

  _this.buttonClick = {};
  _this.notiferId = 1;
  _this.templates = {
    default: {
      type: "basic",
      title: "Notify",
      message: "You have a message.",
      iconUrl: "/assets/icon.png"
    }
  };

  function init() {
    chrome.notifications.onButtonClicked.addListener(function(notiferId, buttonIndex){
      _this.onButtonClicked(notiferId, buttonIndex);
    });
  }

  _this.register = function(name, attr) {
    _this.templates[name] = extend({
      type: "basic",
      iconUrl: attr.iconUrl || _this.templates.default.iconUrl
    }, attr);

    return _this;
  };

  _this.addButtonClick = function(notiferId, onClick, buttonIndex){
    _this.buttonClick[notiferId] = _this.buttonClick[notiferId] || {};
    _this.buttonClick[notiferId][buttonIndex] = onClick;
  };

  _this.onButtonClicked = function(notiferId, buttonIndex){
    var buttons = _this.buttonClick[notiferId] || {};
    if(buttons[buttonIndex]) {
      _this.buttonClick[notiferId][buttonIndex](notiferId, buttonIndex);
    }
  };

  init();

  return _this;
})();

var Notifer = function(name) {
  this.id = NotiferCentre.notiferId++;
  this.buttons = [];
  this.attr = NotiferCentre.templates[name] || NotiferCentre.templates.default;
};

Notifer.prototype.create = function(options) {
  var id = this.id.toString();

  this.attr.title = options.title;
  if(options.message) {
    this.attr.message = options.message;
  }
  if(options.contextMessage) {
    this.attr.contextMessage = options.contextMessage;
  }
  if(options.imageUrl) {
    this.attr.type = "image";
    this.attr.imageUrl = options.imageUrl;
  } else if(options.progress){
    this.attr.type = "progress";
    this.attr.progress = options.progress;
  } else if(options.items) {
    this.attr.type = "list";
    this.attr.progress = options.items;
  }

  if(options.buttons && options.buttons.length) {
    this.attr.buttons = [];
    var addButton = this.addButton;
    options.buttons.forEach(function(option, index) {
      addButton(option.title, function() {
        if(option.link) {
          window.open(option.link);
        }
      }, option.iconUrl, option.index);
    });

    this.attr.buttons = this.buttons;
  }

  chrome.notifications.create(id, this.attr);
  return this;
};

Notifer.prototype.addButton = function(title, onButtonClicked, iconUrl, index) {
  var button = {
    title: title
  };

  if(iconUrl) button.iconUrl = iconUrl;

  if(index) {
    this.buttons[index] = button;
  } else {
    index = this.buttons.push(button) - 1;
  }

  NotiferCentre.addButtonClick(this.id, onButtonClicked, index);

  return this;
};
