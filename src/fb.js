import React from 'react';

class LoginComponent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
    
        };
      }

    loadFbLoginApi(){
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

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
    }
    componentDidMount(){
        this.loadFbLoginApi();
    }

    statusChangeCallback(response){
        if (response.status === 'connected') {   // Logged into your webpage and Facebook.
            $.post("handler.php",{access_token: response["authResponse"]["accessToken"]},function(data){
              console.log(data);
            })   
            FB.api(
                  '/me',
                  'GET',
                  {"fields":"id,name,email"},
                  function(response) {
                      console.log(response)
                      
                  }
                );
          } else {                                 // Not logged into your webpage or we are unable to tell.
            document.getElementById('status').innerHTML = 'Please log ' +
              'into this webpage.';
          }
    }

    checkLoginState(){
        FB.getLoginStatus(function(response) {   // See the onlogin handler
            statusChangeCallback(response);
          });
    }
    handleFBLogin(){
        FB.login(this.checkLoginState());
    }
    render(){
        return(
            <div>
                <div class="fb-login-button" data-onlogin = {this.checkLoginState} data-width="" data-size="large" data-button-type="login_with" data-layout="default" data-auto-logout-link="true" data-use-continue-as="true"></div>
            </div>
        )
    }
}

export default LoginComponent;