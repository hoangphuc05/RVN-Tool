



class Comments extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            allChildren: Array(0),
            loaded : 0,
            prefix : "",
            translatedComments: Array(),
        };
        
    }

    handleChange = () => {

        
        saveAll("ta"+this.props.id,this.textarea.value);
        var allChildContent = "";

        
        for (var i=0; i < this.state.translatedComments.length; i++){
            if (this.state.translatedComments[i]!=""){
                allChildContent += this.state.translatedComments[i];
            }
        }

        var toReturn = this.state.prefix + "u/" + this.props.author + "(" + pointFormatter(this.props.score) + " points) \r\n"
            + this.textarea.value +"\r\n\r\n"
            + allChildContent ;

        if (this.state.translatedComments===""){
            toReturn = "";
        }
        this.props.changeContent(toReturn,this.props.order);
    }

    updateComment = (translatedComment,order) =>{
        this.state.translatedComments[order]= translatedComment;
        this.handleChange();
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
                        

  
                        allChildren.push(<Comments body_html={ tempChildren[m]['data']['body_html']}
                            author = {tempChildren[m]['data']['author']}
                            score = {pointFormatter(tempChildren[m]['data']['score'])}
                            id = {tempChildren[m]['data']['id']}
                            level = {currentLevel + 1}
                            children = {tempChildren[m]['data']['replies']}
                            order={m}
                            changeContent = {this.updateComment}

                        />)
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
                <div className = {"collapse " + this.props.id} id = {this.props.id}>
                    <div className={"row"}>
                        <div class="col-md-6">
                        
                        <div className={"collapse "+this.props.id}>
                            <div class=" card card-body fullrow">
                                <p><b>{prefix}u/{this.props.author}({pointFormatter(this.props.score)} points)</b><br/></p>
                                <div dangerouslySetInnerHTML={{__html:htmlDecode(this.props.body_html)}}/>
                            </div>
                        </div>
                        </div>
                        <div class="col-md-6">
                        <div className={"collapse "+this.props.id} id={this.props.id+"Translated"}>
                            <div class="card card-body fullrow">
                                <p style = {{height: "100%"}}><b>{prefix}u/{this.props.author}({pointFormatter(this.props.score)} points)</b><br/>
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

default export Comments