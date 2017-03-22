
// Returns a new notification ID used in the notification.
function getNotificationId() {
  var id = Math.floor(Math.random() * 9007199254740992) + 1;
  return id.toString();
}

var myId = "";

function messageReceived(message) {
  
  console.log("Message received: " + message.data['id'] + ' / ' + message.data['message']);

  // Set up my sessionId to distinguish the message sender
  if(myId == ""){
    myId = message.data['id'];
    return;
  }

  // We do not need to do noti when this message is from this client.
  if(myId == message.data['id'])
    return;

  // Pop up a notification to show the GCM message.
  chrome.notifications.create(getNotificationId(), {
    title: 'MSP Chat CodeLab',
    iconUrl: 'gcm_128.png',
    type: 'basic',
    message: message.data['message']
  }, function() {});
}

var registerWindowCreated = false;

function firstTimeRegistration() {
  chrome.storage.local.get("registered", function(result) {

    registerWindowCreated = true;
    chrome.app.window.create(
      "register.html",
      {  width: 400,
         height: 600,
         frame: 'chrome'
      },
      function(appWin) {}
    );
  });
}

// Set up a listener for GCM message event.
chrome.gcm.onMessage.addListener(messageReceived);

// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);
