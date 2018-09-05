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

  var Owner = 'Ekram';
  var Friend = 'Ramisa';


  FetchOwnMessagesTimeAndPopulate();
  FetchFriendMessagesTimeAndPopulate();

function print(x){
    console.log(x);
}




function CreateSingleMessage(Recipient, Message_, OnlyTIME){


    var SingleMessage = document.createElement('div');
    SingleMessage.setAttribute('class', 'SingleMessage');

    if (Recipient=='Owner') {

        var MessageContOwner = document.createElement('div');
        MessageContOwner.setAttribute('class', 'MessageContOwner');

        var Time_ = document.createElement('span');
        Time_.setAttribute('class', 'Time_');

        var t = document.createTextNode(OnlyTIME);
        Time_.append(t);

        var InnerMessage = document.createElement('span');
        InnerMessage.setAttribute('class', 'InnerMessage');

        var t = document.createTextNode(Message_);
        InnerMessage.append(t);

        MessageContOwner.append(Time_);
        MessageContOwner.append(InnerMessage);

        SingleMessage.append(MessageContOwner);

        document.getElementById('MessagesBox_ID').appendChild(SingleMessage);

    }
    else if (Recipient=='Friend') {

        var MessageContFriend = document.createElement('div');
        MessageContFriend.setAttribute('class', 'MessageContFriend');

        var Time_ = document.createElement('span');
        Time_.setAttribute('class', 'Time_');

        var t = document.createTextNode(OnlyTIME);
        Time_.append(t);

        var InnerMessage = document.createElement('span');
        InnerMessage.setAttribute('class', 'InnerMessage');

        var t = document.createTextNode(Message_);
        InnerMessage.append(t);

        MessageContFriend.append(Time_);
        MessageContFriend.append(InnerMessage);

        SingleMessage.append(MessageContFriend);

        document.getElementById('MessagesBox_ID').appendChild(SingleMessage);
    }
    else {
        print('CreateSingleMessage function invalid Recipent input..');
    }

}



document.getElementById('SendIcon').addEventListener('click', e => {

    var messageToBeSent = document.getElementById('MainInputText_Id').value;

    var d = new Date();
    d.toUTCString();

    onlyTime = String(d).split(' ')[4];

    print(String(onlyTime));

   CreateSingleMessage('Owner', messageToBeSent, onlyTime);

   document.getElementById('MainInputText_Id').value = '';

   var ref = database.ref(Owner + '/OwnMessages/');

   var data = {
        [onlyTime]: messageToBeSent
   }

   ref.update(data).then(function(){
        $('.SingleMessage').remove();
        FetchOwnMessagesTimeAndPopulate();
        FetchFriendMessagesTimeAndPopulate();
   })

});


function FetchOwnMessagesTimeAndPopulate(){

    TimeArray = [];
    MessageArray = [];

    var ref = database.ref(Owner + '/OwnMessages').once('value').then(function(snapshot){

        var totalMessageJSON = snapshot.val();

        var key;
        for (key in totalMessageJSON){
            TimeArray.push(key);
            MessageArray.push(totalMessageJSON[key]);
        }

        print(TimeArray);
        print(MessageArray);

        for (var i = 0; i < TimeArray.length; i++) {

            CreateSingleMessage('Owner', MessageArray[i], TimeArray[i]);

        }

    });

}

function FetchFriendMessagesTimeAndPopulate(){

    TimeArray_ = [];
    MessageArray_ = [];

    var ref = database.ref(Owner + '/FriendMessages').once('value').then(function(snapshot){

        var totalMessageJSON = snapshot.val();

        var key;
        for (key in totalMessageJSON){
            TimeArray_.push(key);
            MessageArray_.push(totalMessageJSON[key]);
        }

        print(TimeArray_);
        print(MessageArray_);

        for (var i = 0; i < TimeArray_.length; i++) {

            CreateSingleMessage('Friend', MessageArray_[i], TimeArray_[i]);

        }

    });

}


 
