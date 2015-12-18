/* global Pusher, PUSHER_KEY, Notifer*/

var Background = function() {
  var _this = {},
      _ports = {},
      _pusher = new Pusher(PUSHER_KEY, { encrypted: true });

  function init() {
    console.log("background:init");

    chrome.runtime.onConnect.addListener(_this.onRuntimeConnect);
    chrome.browserAction.onClicked.addListener(_this.createNotifications);
    chrome.identity.getProfileUserInfo(function(userInfo){
      console.log(userInfo);
      if(userInfo.email){
        _pusher.subscribe(userInfo.email)
          .bind('my_event', _this.createNotifications);
      }
    });
  }

  _this.onRuntimeConnect = function(port) {
    console.log('runtime.onConnect: ', port.name);
    port.postMessage({ message: "initial connection from background"});

    if(port.name === "popup"){
      _ports["popup"] = port;
      port.onMessage.addListener(_this.onPopupMessage);
    }

    if(port.name === "content_scripts") {
      _ports[port.sender.tab.id] = port;
      port.onMessage.addListener(_this.onContentMessage);
    }
  };

  _this.onPopupMessage = function(data, port) {
    console.log("onMessage: ", data, port);
    if(data.event) {
      switch(data.event){
        case "click:popup":
        break;
      }
    }
  };

  _this.onContentMessage = function(data, port) {
    console.log("onMessage: ", data);
  };

  _this.createNotifications = function(options) {
    new Notifer()
      .create(options);
  };

  init();

  return _this;
};

window.addEventListener("load", function() {
  new Background();

  Pusher.log = function(message) {
    if (window.console && window.console.log) {
      window.console.log(message);
    }
  };
}, false);
