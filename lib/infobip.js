var request = require('request');

var Infobip = function(){
    this.connection.username = arguments[0]?arguments[0]:null;
    this.connection.password = arguments[1]?arguments[1]:null;
};

Infobip.prototype.connection = {
    username:"",
    password:""
};

Infobip.prototype.sender = {
    destinaton:[],//array of numbers
    source:"",
    message:"",
    
    //below are properties for voice SMS initialized with default values
    bulkId:"",
    messageId:"",
    text:null,
    audioFileUrl:null,
    language:"en",
    speechRate:1,
    notifyUrl:"",
    notifyContentType:"application/json",
    validityPeriod:720,
    record:false,
    repeatDtmf:"#",
    ringTimeout:45,
    dtmfTimeout:10,
    machineDetection:'hangup'
};

Infobip.prototype.support = {
    voice: true,
    sms: true,
    flash: false
};

function generateAuth(username, password){
    var buffer = new Buffer(username+":"+password);
    return buffer.toString('base64');
}

function sendTTS(){
    if(arguments.length < 3){throw "Invalid Voice/TTS request, Confirm parameters";}
    var Auth = arguments[0];
    var cb = arguments[arguments.length-1];
    var params = arguments[arguments.length-2];
    if(isNaN(params.source)){throw "Voice message can only come from Numbers only ::: "+params.source;}
    let dest_to = [];
    params.destinaton.forEach(function(val){
        dest_to.push({to:val});
    });
    let payload = {
        bulkId:params.bulkId,
        messages:[{
            from:params.source,
            destinations:dest_to,
            language: params.language,
            speechRate: params.speechRate,
            notifyContentType: params.notifyContentType,
            validityPeriod: params.validityPeriod,
            record: params.record,
            repeatDtmf: params.repeatDtmf,
            ringTimeout: params.ringTimeout,
            dtmfTimeout: params.dtmfTimeout,
            machineDetection: params.machineDetection
        }]
    };
    if(params.text !== null){
        payload.messages[0].text = params.text;
    }
    if(params.audioFileUrl !== null){
        payload.messages[0].audioFileUrl = params.audioFileUrl;
    }
//    console.log(payload);
    var apiRequestOptions = {
        uri: "https://api.infobip.com/tts/3/advanced",
        headers:{
            "Authorization":"Basic "+Auth,
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        json:payload
    };
    request.post(apiRequestOptions, function(errReq, resp, body){
//        console.log("Voice response", JSON.stringify(body));
        if(resp.statusCode === 200){
            cb({status:1,message:"Message processed successfully",message_id:body.bulkId});
//           if(params.destinaton.length === 1){
//               if(body[0].messageId){
//                   mess_id = body[0].messageId;
//               }
//               else{
//                   mess_id = body.messages[0].messageId;
//               }
//               cb({status:1,message:"Message processed successfully",message_id:mess_id});
//           }
//           else{
//               cb({status:1,message:"Message processed successfully",message_id:body.bulkId});
//           }
        }
        else{
            cb({status:0,message:body.requestError.serviceException.text,message_id:mess_id});
        }
    });
}

function sendSMS(Auth, from, to, text, cb){
    var apiRequestOptions = {
        uri: "https://api.infobip.com/sms/1/text/multi",
        headers:{
            "Authorization":"Basic "+Auth,
            "Content-Type":"application/json",
            "Accept":"application/json"
        },
        json:{
            messages:[{
                "from":from,
                "to":to,
                "text":text
            }]
        }
    };
    request.post(apiRequestOptions, function(errReq, resp, body){
        //console.log(body);
        if(resp.statusCode === 200){
            if(to.length === 1){
                cb({status:1,message:"Message processed successfully",message_id:body.messages[0].messageId});
            }
            else{
                cb({status:1,message:"Message processed successfully",message_id:body.bulkId});
            }
        }
        else{
            cb({status:0,message:body.requestError.serviceException.text,message_id:null});
        }
    });
}

Infobip.prototype.send = function(){
    var message_type = 'sms';
    var callback = null;
    if(arguments.length === 1){
        callback = arguments[0];
    }
    else{
        message_type = arguments[0];
        callback = arguments[1];
    }
    if(this.sender.source.length > 11) callback({status:0,message:"Invalid Message Source, Text should not be > 11 char",message_id:null});
    if(this.sender.destinaton instanceof Array){
        let Authorization = generateAuth(this.connection.username, this.connection.password);
        switch(message_type){
            case 'sms':
                sendSMS(Authorization, this.sender.source, 
                    this.sender.destinaton, this.sender.message, callback);
                break;
            case 'voice':
                sendTTS(Authorization, this.sender, callback);
                break;
            default:
                callback({status:0,message:"Message type not supported",message_id:null});
        }
    }
    else{
        callback({status:0,message:"Message destination is currupt or badly formatted",message_id:null});
    }
};

module.exports = new Infobip();