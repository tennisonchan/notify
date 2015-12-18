# Notifiy
**Chrome Notifications** + **Pusher** to push message to your teammate

## Setup
Create a file `js/config.js` with your pusher key like this:
```
var PUSHER_KEY = "pusher_key"
```

## Usages
- By default the user's email will be one of the channels.
- Add your custom channel on file `background.js`.
- Use the code below to push a message to your teammate:
`Pusher[channel].trigger("my_event", notification)`
- Format of the notification message
```
{
  type: "Notification Type",
  title: "Notification Title",
  message: "Notification Message",
  iconUrl: "Url of an icon (optional)",
  contextMessage: "Notification contextMessage (optional, basic type)",
  imageUrl: "Url of an image (optional, image type)",
  progress: "Notification progress (optional, progress type)",
  items: [
    { item: "A list object of items (optional, list type)" }
  ],
  buttons: // optional, up to 2 buttons
  [{
    title: "Button's title",
    iconUrl: "Url of an icon (optional)",
    link: "A link to redirect when user clicks on this button"
  }]
}
```
For more information:
- https://developer.chrome.com/apps/notifications
- https://developer.chrome.com/apps/richNotifications
