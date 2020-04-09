alert("aaa");
//this whole things is for fb function
window.fbAsyncInit = function() {
    FB.init({
        appId      : '257047938655927',
        cookie     : true,
        xfbml      : true,
        version    : 'v6.0'
    });
        
    FB.AppEvents.logPageView();   
    FB.getLoginStatus(function(response) {
        console.log(response);
    });
};
(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().;
if (response.status === 'connected') {   // Logged into your webpage and Facebook.
    $.post("handler.php",{access_token: response["authResponse"]["accessToken"]},function(data){
    console.log(data);
    })   
    FB.api(
        '/me',
        'GET',
        {"fields":"id,name,email"},
        function(response) {
            console.log(response);
            fbid = response["id"];
            fbName = response["name"];
        }
        );
} else {                                 // Not logged into your webpage or we are unable to tell.
    document.getElementById('status').innerHTML = 'Please log ' +
    'into this webpage.';
    }
}

function checkLoginState() { 
    // Called when a person is finished with the Login Button.
    FB.getLoginStatus(function(response) {   // See the onlogin handler
        statusChangeCallback(response);
    });
}