$.cookie.json = true;

var wishlist = [
                /*{"name":"Lightning God Ring","price":"9999999998"},
                {"name":"Ice Cold Red", "price": "2999999999"},
                {"name":"Cubic Chaos Blade", "price": "24999999"},
                {"name":"[A] Nebulite (DEX %)", "price": "2999999999"},
                {"name":"[A] Nebulite (STR %)", "price": "2999999999"},*/
               ];


var db;
  
var notId = 0;

$.getJSON("http://maple.fm/api/list/items", function(data) {
    db = data;
    console.log(db);
});

if( $.cookie('server') == undefined ){
    $.cookie('server', '8'); 
}

if( $.cookie('wishlist') != undefined ){
    console.log($.cookie('wishlist'));
    wishlist = $.cookie('wishlist');
}

else  
    $.cookie('wishlist', wishlist);


function show() {
    console.log("bg"+$.cookie('server'));
  
    $.getJSON("http://maple.fm/api/2/search?server="+ $.cookie('server') +"&stats=0&desc=0", function(data) {
  
        console.log(data); // use data as a generic object
        var json = data.fm_items;
        notId = 0;
        $.each(json, function(ind, obj){
            //console.log(obj.name + ' ' + obj.price + ' ' + obj.room);
            $.each(wishlist, function(index, result){
                if(result.name == obj.name && parseInt(result.price) >= parseInt(obj.price) && parseInt(obj.quantity)>=1 ){
                    
                    var shopname = obj.shop_name;
                    if(shopname.length > 25) shopname  = shopname.substring(0,25) + "...";
                
                  $.getJSON("http://maple.fm/api/items?id="+obj.id, function(data){
                  var iconid = data.item.icon;               
                  var notOption = {
                        type : "basic",
                        title: obj.name + " at FM " + obj.room,
                        message: obj.quantity + " pieces at " +obj.price + "\nShop: " + shopname,
                        //buttons: { title: 'stop notifying this item'},
                        //iconUrl: "maple.png",
                        iconUrl: 'http://maple.fm/static/image/icon/'+ obj.icon+ '.png',
                    }

                    chrome.notifications.create(notId.toString(), notOption, creationCallback);
                    notId++;
                    });
                }
            });
        });
    });

}

function creationCallback(notID) {
	console.log("Succesfully created " + notID + " notification" );
}




/*var script = document.createElement('script');
script.src = 'jquery-1.11.2.min.js';
script.type = 'text/javascript';

document.getElementsByTagName('head')[0].appendChild(script);*/

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.watchlist = wishlist;
}

if (JSON.parse(localStorage.isActivated)) { 
    show();
}

var interval = 0; // The display interval, in minutes.

setInterval(function() {
  interval++;
  //chrome.idle.queryState(15, function (state) {
    if (
        JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval 
  //      state == "active"
    ) {
        chrome.notifications.getAll( function(notifications){
          
        });
        for( var i=0; i< notId; i++ ){
          chrome.notifications.clear(i.toString(), deletionCallback); 
        }
        show();
        interval = 0;
    }
  //});
}, 60000);


function additem(itemName,itemPrice) {
	wishlist.push({"name": itemName,"price": itemPrice});
    $.cookie('wishlist', wishlist);
    show();
}

function removeitem(itemName){
    var deleteindex;
    $.each(wishlist, function(index, result){
        if(result.name == itemName){
            deleteindex = index;
        }
    });
    wishlist.splice(deleteindex,1);
    $.cookie('wishlist', wishlist);
}

function deletionCallback(notID) {
	console.log("Succesfully deleted " + notID + " notification" );
}

