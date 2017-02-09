# Infobip
Simple Javascript Library for easy Infobip services integration: [https://dev.infobip.com/](https://dev.infobip.com/) - Which includes SMS, VOICE and TEXT to SPEECH (TTS)

### Installation

`npm install infobip-node`

### How to use ?

```javascript
const username = "xxxxxxx";
const password = "xxxxxxxxx";

var infobip = require('infobip-node')(username, password);

infobip.sender.source = "message-from"; //use numbers only for voice
infobip.sender.destinaton.push('telephone-number');//to send to a single telephone number
//or
infobip.sender.destinaton = ['array-of-many-numbers']; // to send to many telephone numbers in bulk

/**
 For SMS
*/

infobip.sender.message = "message-content"; //text message content

infobip.send('sms', function(response){
  //@response dumps you response from infobip
  console.log(response);
});

/**
For VOICE
*/

infobip.sender.bulkId = "XOXO-898-YXXX"; //your unique generated bulk id for this voice message
infobip.sender.text = ""; //for text to speach (this is optional if @audioFileUrl is defined)
infobip.sender.audioFileUrl = ""; //url of .mp3 recorded voice file to be sent (this is optional if @text is defined)
infobip.sender.notifyUrl = ""; //your callback url where you want to receive(POST) the result of the voice campain when it is processed

infobip.send('voice', function(response){
  //@response dumps you response from infobip 
  console.log(response);
});
```

### More features will be implemented. Anybody can as well contribute to this.

# Thank you.
