import './index.css'
import React , { Component } from 'react';

export default class FoldableDiv extends Component {
    constructor(props){
        super(props);
        this.state = {
            folded : this.props.folded,
        }
    }

    flipFold = () => {
        let newFolded = !(this.state.folded);
        this.setState({
            folded : newFolded,
        });
    }
    render () {
        let {
            children,
            title,
            titleStyle,
        } = this.props;
        let {
            folded
        } = this.state;
        let foldableStyle ;
        if( folded ){
            foldableStyle = {
                ...foldableStyle,
                maxHeight : '50px',
                minHeight : '50px',
            };
        }else{
            foldableStyle = {
                ...foldableStyle,
                maxHeight : '500px',
            }

        }
        return (
            <div className = "foldableDiv" style={foldableStyle} >
                <div className = "foldableDiv-title" style={titleStyle} onClick={this.flipFold}>
                    <p> {title} </p>
                    <button onClick={this.flipFold}>{(folded) ? 'v':'^'} </button>
                </div>
                <div className = "foldableDiv-children">
                    {children}
                </div>
            </div>
        );
    }
}
