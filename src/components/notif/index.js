import './index.css';
import React from 'react';
import {Urgent} from './../../urgent.js';

export default class ToDo extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detailsAreShown : false ,
            commandAreShown : false,
        }
    }
    showDetails = () => {
        if(this.state.commandAreShown) return ;
        this.setState({
            detailsAreShown : !(this.state.detailsAreShown),
        });
    }

    showCommand = () => {
        
        this.setState({
            commandAreShown : !(this.state.commandAreShown) ,
            detailsAreShown : !(this.state.commandAreShown),
        });
    }

    do = (delai=0) => {
        let num_notification = this.props.notif.num_notification;
        let num_app_user_tech_main = this.props.num_user;
        console.log(`do the notif #${num_notification} ${delai} by ${num_app_user_tech_main}`);
        this.props.socket.emit('tech_main do' , { num_notification , num_app_user_tech_main , delai });

    }
    render () {
        let style;
        let sumStyle ;
        let statutStyle ;
        let detailStyle ;
        switch(this.props.notif.statut_code){
            case Urgent.MAX.code :
                style = {
                    borderLeft : '3px solid red',
                    //borderRight : '3px solid red',
                };
                statutStyle = {
                    color : 'red',
                    fontWeight : 'bold',
                }
                break;

            case Urgent.MID.code :
                style = {
                    borderLeft : '3px solid yellow',
                    //borderRight : '3px solid yellow',
                };
                statutStyle = {
                    color : 'yellow',
                    fontWeight : 'bold',
                }
                break;

            case Urgent.MIN.code :
                style = {
                    borderLeft : '3px solid blue',
                    //borderRight : '2px solid blue',
                };
                statutStyle = {
                    color : 'blue',
                //    fontWeight : 'bold',
                }
                break;
             default :
                break;
        }
        if(this.state.detailsAreShown || this.state.commandAreShown){
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
                    <div className="probleme_type" >
                        <p> {this.props.notif.probleme_type} </p>
                        <p> {this.props.notif.code} </p>
                    </div>
                    <div className="probleme_statut" style={statutStyle} >
                        <p> {this.props.notif.statut_libelle} </p>
                        <p> {this.props.notif.lieu} </p>
                    </div>
                    <div className="date_envoie">
                        <p> Date d'envoie : </p>
                        <p> {this.props.notif.date_envoie} </p>
                    </div>
                    <button onClick={this.showDetails}> Details </button>
                    <button onClick={this.showCommand}> repondre </button>
                </div>
                { this.state.detailsAreShown &&
                    <div className="notif-details" style={detailStyle}>
                        <p> Remarque : {this.props.notif.remarque || '-'} </p>
                        <p> Envoyee par : {this.props.notif.sender_username || '-'} </p>
                        <p> Details 1 </p>
                    </div>
                }
                {
                    this.state.commandAreShown &&
                        <div className="notif-command" >
                            <button onClick={()=> this.do()}>prendre en charge</button>
                            <button>faire patienter</button>
                            <button>ouvrir message</button>
                        </div>
                }
            </div>
        );
    }
}

