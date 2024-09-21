import React from 'react'
import ReactDom from 'react-dom'
import $ from 'jquery'
import './index.css'

//import LoginComponent from './fb';




console.log(window.fbid);


function htmlDecode(input){
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

//trying to auto height 

var allPost
var content
var toRestore;
var redditLink;
var redditJSON;


//store facebook
var fbid;
var fbName;


//autosave
var timeoutId;


function autoSave(){

    $("#save").html("Saving");
    $("#save").attr('class','btn btn-warning');
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
        // Runs 1 second (1000 ms) after the last change   
        $("#save").html("Saved&nbsp;");
        $("#save").attr('class','btn btn-success');
        localStorage.setItem('traslatedContent', JSON.stringify(allContent));
        localStorage.setItem('rdLink',redditLink);
        localStorage.setItem('rdJson',JSON.stringify(content)); 
        if(window.logined == 1){
            window.sendPost(window.postid, window.title);
            window.sendJson(window.postid, JSON.stringify(content));
            window.sendContent(window.postid, JSON.stringify(allContent));
        }
    }, 1000);
};



var event = new Event('input', { bubbles: true });

window.onbeforeunload = function(){
    return 'Save chưa bạn ơi?';
  };
$('#rdFetch').click( function(){
    //document.getElementById('root').innerHTML= '';
    //redditLink = $("#rdLink").val()

    window.postid = $("#rdLink").val();

    redditLink = $("#rdLink").val()
    $.get(redditLink+".json",function(data){
        //redditJSON = data;
        content = data;
        redditLink ="https://www.reddit.com" + content[0]['data']['children'][0]['data']['permalink'];
        $("#rdLink").val(redditLink);
        //console.log(htmlDecode(content[0]['data']['children'][0]['data']['selftext_html']));
        
        allPost = <AllPost/>
        ReactDom.render(
            <AllPost handleSave = {save}/>,
            document.getElementById('root')
        );

        
    });

})

var allContent={};
function saveAll(id, translatedContent){
    autoSave()

    allContent[id] = translatedContent;

}

function save(allPost){


}

function saveOnline(fbid){
    
}



$('#save').click( function(){
    localStorage.setItem('traslatedContent', JSON.stringify(allContent));
    localStorage.setItem('rdLink',redditLink);
    localStorage.setItem('rdJson',JSON.stringify(content));
    alert("Hình như là đã save");

})

function pointFormatter(a){
    return 999 < a ? (a / 1E3).toFixed(1) + "k" : a
}

function getRestoreObject(){
    var demo = '{"tasubmission":"ab","taflj1n38":"fghd"}';
    toRestore = demo;

}

$('#restore').click( function(){
    toRestore = localStorage.getItem('traslatedContent')
    redditLink = localStorage.getItem('rdLink');
    redditJSON = localStorage.getItem('rdJson');

    //getRestoreObject();
    
    $("#rdLink").val(redditLink);
    content = JSON.parse(redditJSON);
    ReactDom.render(
        <AllPost handleSave = {save}/>,
        document.getElementById('root')
    );

    var restoreObject = JSON.parse(toRestore);
    for (var key of Object.keys(restoreObject)){

        saveAll(key,restoreObject[key]);
        $('#'+key).text(restoreObject[key]);
        //$('#'+key)
        try{
            document.getElementById(key).dispatchEvent(event);
        } catch(error){
            console.log(error);
        }
    }

})

$('#restore2').click( function(){

    window.checkLoginState() 

    $.post("https://hphucs.me/rdex/handler.php",{fbid: window.fbid, restore: 1},function(data){
        var recievedData;
        console.log(data);
        recievedData =  JSON.parse(data);
        toRestore = recievedData[0]["content"];
        redditLink = JSON.parse(recievedData[0]["rdjson"])[0]["data"]["children"][0]["data"]["url"];
        redditJSON = recievedData[0]["rdjson"];

        window.postid = recievedData[0]["postid"];

        $("#rdLink").val(redditLink);
        content = JSON.parse(redditJSON);
        ReactDom.render(
            <AllPost handleSave = {save}/>,
            document.getElementById('root')
        );

        var restoreObject = JSON.parse(toRestore);
        for (var key of Object.keys(restoreObject)){

            saveAll(key,restoreObject[key]);
            $('#'+key).text(restoreObject[key]);
            //$('#'+key)
            try{
                document.getElementById(key).dispatchEvent(event);
            } catch(error){
                console.log(error);
            }
        }
    
    }) 
    



})



class AllPost extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            translatedSubmission: null,
            translatedComments : Array(),
            traslatedAll : null,
        }
    }

    updateSubmission = (translatedContent) =>{
        this.setState({translatedSubmission: translatedContent},() => this.updateAll());
        //this.state.translatedSubmission = translatedContent;
        //this.updateAll();
    }

    updateComment = (translatedComment,order) =>{
        this.state.translatedComments[order]= translatedComment;
        this.updateAll();
    }

    updateAll = ()=>{
        var translatedSubmission = this.state.translatedSubmission;
        var allComments = "";
        for (var i =0; i< this.state.translatedComments.length; i++){
            if(this.state.translatedComments[i] != ""){
                allComments += this.state.translatedComments[i]  + "____________________"+"\r\n";
            }
        }
        this.setState({traslatedAll:translatedSubmission + allComments})
    }

    
    runRestore = () =>{

        
    }

    copyResult = () => {
        var dummy = document.createElement("textarea");
        document.getElementById("model-body").append(dummy);
        // to avoid breaking orgain page when copying more words
        // cant copy when adding below this code
        // dummy.style.display = 'none'
        //document.body.appendChild(dummy);
        //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
        dummy.value = this.state.traslatedAll;
        dummy.select();
        dummy.setSelectionRange(0, 99999);
        document.execCommand("copy");
        document.getElementById("model-body").removeChild(dummy);
        alert("Text copied");
    }

    render(){

        var elements=[];
       
        elements.push(<Submission changeContent = {this.updateSubmission}/>);
        

        if (content[1]['data']['children'][content[1]['data']['children'].length - 1]['kind'] == "t1"){
            for (var i=0; i < content[1]['data']['children'].length;i++){

                var tempChildren = content[1]['data']['children'][i]['data']['replies']== "" ? null : content[1]['data']['children'][i]['data']['replies']['data']['children']
    
                this.state.translatedComments = this.state.translatedComments.concat([""]);
                //this.setState({translatedComments: this.state.translatedComments.concat([""])});
    
                elements.push(<Comments body_html={ content[1]['data']['children'][i]['data']['body_html']}
                            author = {content[1]['data']['children'][i]['data']['author']}
                            score = {pointFormatter(content[1]['data']['children'][i]['data']['score'])}
                            id = {content[1]['data']['children'][i]['data']['id']}
                            level = {1}
                            children = {tempChildren}
                            allChildren = {Array(0)}
                            order = {i}
                            changeContent = {this.updateComment}
                            awards = {content[1]['data']['children'][i]['data']["all_awardings"]}
    
                        />)
            }
        } else {
            for (var i=0; i < content[1]['data']['children'].length - 1;i++){

                var tempChildren = content[1]['data']['children'][i]['data']['replies']== "" ? null : content[1]['data']['children'][i]['data']['replies']['data']['children']
    
                this.state.translatedComments = this.state.translatedComments.concat([""]);
                //this.setState({translatedComments: this.state.translatedComments.concat([""])});
    
                elements.push(<Comments body_html={ content[1]['data']['children'][i]['data']['body_html']}
                            author = {content[1]['data']['children'][i]['data']['author']}
                            score = {pointFormatter(content[1]['data']['children'][i]['data']['score'])}
                            id = {content[1]['data']['children'][i]['data']['id']}
                            level = {1}
                            children = {tempChildren}
                            allChildren = {Array(0)}
                            order = {i}
                            changeContent = {this.updateComment}
                            awards = {content[1]['data']['children'][i]['data']["all_awardings"]}
    
                        />)
            }
        }

        return( <div>

            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#resultModal">
                Preview
            </button>
           
            <div class="modal fade" id="resultModal" tabindex="-1" role="dialog" aria-labelledby="TranslatedResult" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLongTitle">Preview content</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div id="model-body" class="modal-body" style={{whiteSpace: "pre-line"}}>
                        <p id="FinalResult">{this.state.traslatedAll}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" onClick={this.copyResult}>Copy text</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
            {elements}

            </div>
            )
    }
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
            awardString: ""

        }

        //for award processing---------------------------------------------------------
        var aWardCount = 0; //count the number of current award, limit it to 3
        var allAwards = content[0]["data"]['children'][0]['data']['all_awardings']
        console.log(allAwards);
        var ignoredCount = 0
        //list all the award
        for (var i = 0; i <allAwards.length;i++){
            if (allAwards[i]["id"] === "gid_2"){
                this.state.awardString += " - x" + allAwards[i]["count"] + " gold";
                if (allAwards[i]["count"] > 1){
                    this.state.awardString += "s";
                }
                aWardCount++;
            }

            else if (allAwards[i]["id"] === "gid_3"){
                this.state.awardString += " - x" + allAwards[i]["count"] + " platinum";
                if (allAwards[i]["count"] > 1){
                    this.state.awardString += "s";
                }
                aWardCount++;
            }

            else if (allAwards[i]["id"] === "gid_1"){
                this.state.awardString += " - x" + allAwards[i]["count"] + " silver";
                if (allAwards[i]["count"] > 1){
                    this.state.awardString += "s";
                }
                aWardCount++;
            }

            else if (aWardCount < 3){
                this.state.awardString += " - x" + allAwards[i]["count"] + " " + allAwards[i]["name"];
                aWardCount++;
            }
            else{
                ignoredCount += 1;
            }
        }
        
        if (ignoredCount > 0){
            this.state.awardString += " & " + ignoredCount + " more"
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
                        + "u/" + this.state.author + "(" + pointFormatter(this.state.score) + " points" + this.state.awardString + ") \r\n" 
                        + this.textarea.value + "\r\n"
                        +"____________________"+"\r\n"
                        +"Link Reddit: https://redd.it/" + (new URL($("#rdLink").val()).pathname.split("/")[4])+"\r\n"
                        +"____________________"+"\r\n"
                        +"Translated by " + "\r\n"
                        +"Edited by https: //hphucs .me/reddit2/";
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
                    <b>u/{this.state.author} ({this.state.score} points{this.state.awardString})</b><br/>
                    {this.state.title}</p>
                    <div dangerouslySetInnerHTML={{__html:htmlDecode(this.state.selftext)}} />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div className={"collapse show " +this.props.name} id="mainBodyTranslated">
                <div class="card card-body fullrow">
                  <p style = {{height: "100%"}}><b>r/{this.state.subreddit}</b><br/>
                  <b>u/{this.state.author} ({this.state.score} points{this.state.awardString})</b><br/>
                  <textarea style = {{height: "90%"}} id="tasubmission" onChange={this.handleChange} ref={(ref) => this.textarea = ref}></textarea><br/></p>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

class Comments extends React.Component{

    

    constructor(props){
        super(props)

        this.state = {
            allChildren: Array(0),
            loaded : 0,
            prefix : "",
            translatedComments: Array(),
            awardString:""
        };

        //process award--------------------------------------------------
        var aWardCount = 0;
        var allAwards = this.props.awards;
        var ignoredCount = 0
        //list all the award
        for (var i = 0; i <allAwards.length;i++){
            if (allAwards[i]["id"] === "gid_2"){
                this.state.awardString += " - x" + allAwards[i]["count"] + " gold";
                if (allAwards[i]["count"] > 1){
                    this.state.awardString += "s";
                }
                aWardCount++;
            }

            else if (allAwards[i]["id"] === "gid_3"){
                this.state.awardString += " - x" + allAwards[i]["count"] + " platinum";
                if (allAwards[i]["count"] > 1){
                    this.state.awardString += "s";
                }
                aWardCount++;
            }

            else if (allAwards[i]["id"] === "gid_1"){
                this.state.awardString += " - x" + allAwards[i]["count"] + " silver";
                if (allAwards[i]["count"] > 1){
                    this.state.awardString += "s";
                }
                aWardCount++;
            }

            else if (aWardCount < 3){
                this.state.awardString += " - x" + allAwards[i]["count"] + " " + allAwards[i]["name"];
                aWardCount++;
            }
            else{
                ignoredCount += 1;
            }
        }
        
        if (ignoredCount > 0){
            this.state.awardString += " & " + ignoredCount + " more"
        }
        
    }

    handleChange = () => {
        
        
        saveAll("ta"+this.props.id,this.textarea.value);
        var allChildContent = "";

        
        for (var i=0; i < this.state.translatedComments.length; i++){
            if (this.state.translatedComments[i]!=""){
                allChildContent += this.state.translatedComments[i];
            }
        }

        var toReturn = "\r\n" + this.state.prefix + "u/" + this.props.author + "(" + pointFormatter(this.props.score) + " points"+ this.state.awardString +") \r\n"
            + this.textarea.value +"\r\n"
            + allChildContent ;

        if (this.state.translatedComments===""){
            toReturn = "";
        }
        this.props.changeContent(toReturn,this.props.order);

        
    }

    updateComment = (translatedComment,order) =>{
        //This is for a perfomact test
        var t0 = performance.now()

        this.state.translatedComments[order]= translatedComment;
        this.handleChange();

        var t1 = performance.now()
        console.log("Call to Handlechange took " + (t1 - t0) + " milliseconds.")
    }


    loadMore(children){
        var allChildren = Array(0);
        if (children && !this.state.loaded){
            var child;
            var currentComment;

            var currentLevel = this.props.level;

            $.ajax({url : redditLink+ this.props.id + ".json", async:false, success:function(data){
                currentComment = data;
            }});

            

                if (currentComment[1]['data']['children'][0]["data"]["replies"] != ""){
                    var tempChildren = currentComment[1]['data']['children'][0]["data"]["replies"]['data']['children'];
                    for (var m =0; m < tempChildren.length; m++){

                        this.state.translatedComments = this.state.translatedComments.concat([""]);
                        
                        let kind = tempChildren[m]['kind'];
                        if (kind == "t1") {
                            console.log(tempChildren[m]['data']["all_awardings"]);
                            allChildren.push(<Comments body_html={tempChildren[m]['data']['body_html']}
                                author={tempChildren[m]['data']['author']}
                                score={pointFormatter(tempChildren[m]['data']['score'])}
                                id={tempChildren[m]['data']['id']}
                                level={currentLevel + 1}
                                children={tempChildren[m]['data']['replies']}
                                order={m}
                                changeContent={this.updateComment}
                                awards={tempChildren[m]['data']["all_awardings"]}
                            />)
                        }
                    }
                        
                }   
            

            


            
            this.setState({allChildren : allChildren});
            this.setState({loaded:1});
        };
    }

    render(){

        //processing all the children comments
        var prefix = "";
        for (var i = 1; i < this.props.level; i++){
            prefix +=">";
        }
        //this.setState({prefix:prefix})
        this.state.prefix = prefix;
        return(
            <div className={"ml-" +this.props.level}>
                <a class="btn btn-light" data-toggle="collapse" data-target={"."+this.props.id} role="button" aria-expanded="false" aria-controls={this.props.id} 
                onClick = {() => this.loadMore(this.props.children)}
                >
                    <b>{prefix}u/{this.props.author}({pointFormatter(this.props.score)} points)</b>
                </a>


                    <div className = {"collapse outerComments " + this.props.id} id = {this.props.id}>
                        <div className={"row"}>
                        
                            <div class="col-md-6">
                                <div class="row">

                                    <div className={"collapse col-md-11 "+this.props.id}>
                                        <div class=" card card-body fullrow">
                                            <p><b>{prefix}u/{this.props.author}({pointFormatter(this.props.score)} points{this.state.awardString})</b><br/></p>
                                            <div dangerouslySetInnerHTML={{__html:htmlDecode(this.props.body_html)}}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                            <div className={"collapse "+this.props.id} id={this.props.id+"Translated"}>
                                <div class="card card-body fullrow">
                                    <p style = {{height: "100%"}}><b>{prefix}u/{this.props.author}({pointFormatter(this.props.score)} points{this.state.awardString})</b><br/>
                                <textarea id={"ta"+this.props.id} onChange={this.handleChange} ref={(ref) => this.textarea =ref}></textarea></p>
                                </div>
                            </div>
                            </div>
                        </div>
                    
                        {this.state.allChildren}
                    </div>

          </div>
        )
    }
}


//======
/*

$('.outerComments').click(function(e){
    if(  e.offsetX <= parseInt($(this).css('borderLeftWidth'))){
       
    }
});

$('.outerComments').hover(function(e){
    if(  e.offsetX <= parseInt($(this).css('borderLeftWidth'))){
       $(this).css("border-left-color", "#999");
    }
    else{
        $(this).css("border-left-color", "#f2f2f2");
    }
});*/
