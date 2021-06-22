import './notif.css';
import React from 'react';
import {Urgent} from '../urgent';

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
        let style;
        let sumStyle ;
        let detailStyle ;
        switch(this.props.notif.statut){
            case Urgent.MAX :
                style = {
                    borderLeft : '3px solid red',
                    //borderRight : '3px solid red',
                };
                break;

            case Urgent.MID :
                style = {
                    borderLeft : '3px solid yellow',
                    //borderRight : '3px solid yellow',
                };
                break;

            case Urgent.MIN :
                style = {
                    borderLeft : '3px solid blue',
                    //borderRight : '2px solid blue',
                };
                break;
             default :
                break;
        }
        if(this.state.detailsAreShown){
            detailStyle = {
                height : "80%",
            };
            sumStyle = {
                height : "15%",
            };
            style = {
                ...style,
                height : "300px",
            }

        }
        return (
            <div className="notif" style={style} >
                <div className="notif-sum" style={sumStyle}>
                    <h2> {this.props.notif.title} </h2>
                    <p> salle xxx </p>
                    <p> {this.props.notif.ETA} </p>
                    <p> {this.props.notif.statut} </p>
                    <button onClick={this.showDetails}> Details </button>
                </div>
                { this.state.detailsAreShown &&
                    <div className="notif-details" style={detailStyle}>
                        <p> Details </p>
                        <p> Details 1 </p>
                    </div>
                }
            </div>
        );
    }
}

