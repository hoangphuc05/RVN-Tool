import React from 'react'
import ReactDom from 'react-dom'
import $ from 'jquery'
import './index.css'
import Submission from './submission'

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
                allComments += this.state.translatedComments[i]  + "__________________________"+"\r\n";
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

export default AllPost;