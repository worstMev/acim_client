import './toDo.css';
import React from 'react';

export default class ToDo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detailsAreShown : false ,
        }
    }
    showDetails = () => {
        this.setState({
            detailsAreShown : !(this.state.detailsAreShown),
        });
    }
    render () {
        let sumStyle ;
        let detailStyle = {
            display : "none",
        };
        let toDoStyle;
        if(this.state.detailsAreShown){
            detailStyle = {
                height : "80%",
            };
            sumStyle = {
                height : "15%",
            };
            toDoStyle = {
                height : "300px",
            }

        }
       
        return (
            <div className="toDo" style={toDoStyle} >
                <div className="toDo-sum" style={sumStyle} >
                    <h2> {this.props.toDo.title} </h2>
                    <p> salle xxx </p>
                    <p> {this.props.toDo.ETA} </p>
                    <button onClick={this.showDetails}> Details </button>
                </div>
                <div className="toDo-details" style={detailStyle} >
                    <p> Details </p>
                    <p> Details 1 </p>
                </div>
            </div>
        );
    }
}
/*
 *
                    <h2> {this.props.toDo.title} </h2>
                    <p> salle xxx </p>
                    <p> {this.props.toDo.ETA} </p>
                    <button onClick={this.showDetails}> Details </button>

                    <p> Details </p>
                    <p> Details 1 </p>
 */
