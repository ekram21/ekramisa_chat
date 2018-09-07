  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCdJNWfU9U23Xwf7Bhe5WqyX5WiLzj4wQA",
    authDomain: "ekramisa-chat.firebaseapp.com",
    databaseURL: "https://ekramisa-chat.firebaseio.com",
    projectId: "ekramisa-chat",
    storageBucket: "ekramisa-chat.appspot.com",
    messagingSenderId: "534663980615"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $('.TextCont').fadeOut('fast');


Naruto3 = 'https://i.imgur.com/bpcqFAz.png';
NarutoAngry = 'https://i.imgur.com/Z0gqszM.png';
NarutoSmile = 'https://i.imgur.com/IMX0gLB.png';
  
function print(x){
    console.log(x);
}




function CreateSingleMessage(Recipient, messageWriter, Message_, OnlyTIME){


    var SingleMessage = document.createElement('div');
    SingleMessage.setAttribute('class', 'SingleMessage');

    if (Recipient=='Owner') {

        var MessageContOwner = document.createElement('div');
        MessageContOwner.setAttribute('class', 'MessageContOwner');

        var MessageWriter = document.createElement('span');
        MessageWriter.setAttribute('class', 'MessageWriter');

        var t = document.createTextNode(messageWriter);
        MessageWriter.append(t);

        var Time_ = document.createElement('span');
        Time_.setAttribute('class', 'Time_');

        var t = document.createTextNode(OnlyTIME);
        Time_.append(t);

        var InnerMessage = document.createElement('span');
        InnerMessage.setAttribute('class', 'InnerMessage');

        var t = document.createTextNode(Message_);
        InnerMessage.append(t);

        MessageContOwner.append(Time_);
        MessageContOwner.append(MessageWriter);
        MessageContOwner.append(InnerMessage);

        SingleMessage.append(MessageContOwner);

        document.getElementById('MessagesBox_ID').appendChild(SingleMessage);

    }
    else if (Recipient=='Friend') {

        var MessageContFriend = document.createElement('div');
        MessageContFriend.setAttribute('class', 'MessageContFriend');

        var MessageWriter = document.createElement('span');
        MessageWriter.setAttribute('class', 'MessageWriter');

        var t = document.createTextNode(messageWriter);
        MessageWriter.append(t);

        var Time_ = document.createElement('span');
        Time_.setAttribute('class', 'Time_');

        var t = document.createTextNode(OnlyTIME);
        Time_.append(t);

        var InnerMessage = document.createElement('span');
        InnerMessage.setAttribute('class', 'InnerMessage');

        var t = document.createTextNode(Message_);
        InnerMessage.append(t);

        MessageContFriend.append(Time_);
        MessageContFriend.append(MessageWriter);
        MessageContFriend.append(InnerMessage);

        SingleMessage.append(MessageContFriend);

        document.getElementById('MessagesBox_ID').appendChild(SingleMessage);
    }
    else {
        print('CreateSingleMessage function invalid Recipent input..');
    }

}

document.getElementById('chooseFriendName_ID').addEventListener('click', e => {

    $('.TextCont').fadeIn('slow');

    friendName = document.getElementById('chooseFriendName_ID').getAttribute("data-main");

    document.getElementById('FriendName_ID').value = friendName;

    var Owner = document.getElementById('LoginID').getAttribute("data-main");
    var RoomID = 'MessageRoom' + Owner + friendName; //Ekram/MessageRoomEkramRamisa

    address = Owner + '/' + RoomID + '/';

    print(address);

    AutoPollingUpdater(address);

    $('.SingleMessage').remove();

    FetchMessagesWithTimeAndPopulate(friendName);

});



document.getElementById('SendIcon').addEventListener('click', e => {

    var messageToBeSent = EncodeString(document.getElementById('MainInputText_Id').value);

    var Owner = document.getElementById('LoginID').getAttribute("data-main");
    var Friend = document.getElementById('FriendName_ID').value;
    var messageWriter = Owner;

    var d = new Date();
    d.toUTCString();

    onlyTime = String(d).split(' ')[4];

   //CreateSingleMessage('Owner', Owner, messageToBeSent, onlyTime);

   document.getElementById('MainInputText_Id').value = ''; //reset the input area to null



   //DATABASE STUFF
   //now enter this data in own firebase and friends firebase
   var ownRoomID = 'MessageRoom' + Owner + Friend;

   var ref = database.ref(Owner + '/' + ownRoomID + '/'); // Ekram/MessageRoomEkramRamisa/

   var data = {};

   data[messageWriter] = {};

   data[messageWriter] = {
    [onlyTime] : messageToBeSent
   };

   ref.push(data).then(function(){
        print('Successfully sent message!');

        //now write this message in friends RoomID database

        if (Friend!=null){
            var friendRoomID = 'MessageRoom' + Friend + Owner;

            var ref = database.ref(Friend + '/' + friendRoomID + '/');

           var data = {};

           data[messageWriter] = {};

            data[messageWriter] = {
                [onlyTime] : messageToBeSent
            };

            ref.push(data);
        }

   })

});


function FetchMessagesWithTimeAndPopulate(FriendName){

    var Owner = document.getElementById('LoginID').getAttribute("data-main");
    var Friend = FriendName;
    var messageWriter = Owner;

    TimeArray = [];
    MessageArray = [];
    messageOwner = [];

    var RoomID = 'MessageRoom' + Owner + Friend; //Ekram/MessageRoomEkramRamisa

    var ref = database.ref(Owner + '/' + RoomID + '/').once('value').then(function(snapshot){

        var totalMessageJSON = snapshot.val();

        var key; //this is chrono key
        for (key in totalMessageJSON){

            ActualJSON = totalMessageJSON[key];

            var key2; // this is messageWriter
            for (key2 in ActualJSON){
                messageOwner.push(key2);

                var key3;
                for (key3 in ActualJSON[key2]){
                    TimeArray.push(key3);
                    MessageArray.push(DecodeString(ActualJSON[key2][key3]));
                }
            }
        }

        for (var i = 0; i < TimeArray.length; i++) {

            recipient = '';
            if (messageOwner[i] == Owner){
                recipient = 'Owner';
            }
            else if (messageOwner[i] == Friend){
                recipient = 'Friend';
            }
            else {
                break;
            }

            CreateSingleMessage(recipient, messageOwner[i], MessageArray[i], tConvert(TimeArray[i]));

        }

        var elem = document.getElementById('MessagesBox_ID');
        elem.scrollTop = elem.scrollHeight;

    });

}




function handleEvent(event, snapshot, optionalPreviousChildKey) {

    messageWriter = '';
    messageTime = '';
    innerMessage = '';

    var Friend = document.getElementById('FriendName_ID').value;
    var Owner = document.getElementById('LoginID').getAttribute("data-main");

    console.log(snapshot.val());

    var key;
    for (key in snapshot.val()) {
        messageWriter = key;

        var key2;
        for (key2 in snapshot.val()[key]){
            messageTime = key2;
            innerMessage = DecodeString(snapshot.val()[key][key2]);
        }
    }

    recipient = '';
    if (messageWriter == Owner){
        recipient = 'Owner';
    }
    else if (messageWriter == Friend){
        recipient = 'Friend';
    }

    CreateSingleMessage(recipient, messageWriter, innerMessage, tConvert(messageTime));

    var elem = document.getElementById('MessagesBox_ID');
    elem.scrollTop = elem.scrollHeight;

    // $('.SingleMessage').remove();

    // friendName = document.getElementById('chooseFriendName_ID').getAttribute("data-main");

    // FetchMessagesWithTimeAndPopulate(friendName);
}

function AutoPollingUpdater(address){
    var ref = database.ref(address);

    ref.limitToLast(1).on("child_added", function(snapshot, previousChildKey) { handleEvent("child_added", snapshot, previousChildKey); })
}


function EncodeString(inputString) {
    outputstring = encodeURIComponent(inputString).replace(/\./g, '%2E');

    return outputstring
}

function DecodeString(inputString) {
    outputstring = decodeURIComponent(inputString);
    withoutdots = outputstring.replace('%2E','.');

    return withoutdots
}

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours

  }

  return time.join (''); // return adjusted time or original string
}







