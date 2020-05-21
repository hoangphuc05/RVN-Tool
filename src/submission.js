import React from 'react'
import ReactDom from 'react-dom'
import $ from 'jquery'
import './index.css'

function pointFormatter(a){
    return 999 < a ? (a / 1E3).toFixed(1) + "k" : a
}

function htmlDecode(input){
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

class Submission extends React.Component{
    constructor(props){
        super(props);
        window.title = content[0]['data']['children'][0]['data']['title'];
        this.state = {
            subreddit: content[0]["data"]["children"][0]["data"]["subreddit"],
            author: content[0]["data"]["children"][0]['data']['author'],
            selftext: content[0]['data']['children'][0]['data']['selftext_html'],
            title:content[0]['data']['children'][0]['data']['title'],
            score:pointFormatter(content[0]['data']['children'][0]['data']['score']),
            translatedContent:"",

        }
        /*$('#rdFetch').on("click", ()=>{
            
            $.get($("#rdLink").val()+".json",function(data){
                //alert($("#rdLink").val())
                content = data;
                console.log(htmlDecode(content[0]['data']['children'][0]['data']['selftext_html']));
                //update();
            });
  
        
        });*/

    }
    
    handleChange = () => {
        

        saveAll("tasubmission", this.textarea.value);
        var toReturn = "r/" + this.state.subreddit + "\r\n" 
                        + "u/" + this.state.author + "(" + pointFormatter(this.state.score) + " points) \r\n" 
                        + this.textarea.value + "\r\n"
                        +"__________________________"+"\r\n"
                        +"Link Reddit: https://redd.it/" + (new URL($("#rdLink").val()).pathname.split("/")[4])+"\r\n"+
                        "__________________________"+"\r\n";
        this.props.changeContent(toReturn);
        //console.log("change handled");
    }

    render(){
        this.state.subreddit= content[0]["data"]["children"][0]["data"]["subreddit"];
        this.state.author= content[0]["data"]["children"][0]['data']['author'];
        this.state.selftext= content[0]['data']['children'][0]['data']['selftext_html'];
        this.state.title= content[0]['data']['children'][0]['data']['title'];
        this.state.score =pointFormatter(content[0]['data']['children'][0]['data']['score']);
        this.state.translatedContent="";
        return(

            
            
            <div class="row">
            <div class="col-md-6">
            
              <div className={"collapse show " +this.props.name} id ="mainBody">
                <div class="card card-body fullrow">
                    <p><b>r/{this.state.subreddit}</b><br/>
                    <b>u/{this.state.author} ({this.state.score} points)</b><br/>
                    {this.state.title}</p>
                    <div dangerouslySetInnerHTML={{__html:htmlDecode(this.state.selftext)}} />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div className={"collapse show " +this.props.name} id="mainBodyTranslated">
                <div class="card card-body fullrow">
                  <p style = {{height: "100%"}}><b>r/{this.state.subreddit}</b><br/>
                  <b>u/{this.state.author} ({this.state.score} points)</b><br/>
                  <textarea style = {{height: "90%"}} id="tasubmission" onChange={this.handleChange} ref={(ref) => this.textarea = ref}></textarea><br/></p>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default Submission;