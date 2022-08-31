import './index.css';
import React from 'react';
import {Urgent} from './../../urgent.js';
import DateHourMinute from './../dateHourMinute';

/*
 * props :
 * addToListToCall  : to trigger calls
 */

export default class Notif extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detailsAreShown : false ,
            commandAreShown : false,
        }
        this.notifRef = React.createRef();
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
        this.notifRef.current.style.border = '2px solid green';

    }
    call = ({username_user , num_app_user_user}) => {
        //alert(`appeller ${username_user} avec num ${num_app_user_user}`);
        //create a peer for the peerServer
        let { num_notification } = this.props.notif;
        
        let userToCall = { num_user : num_app_user_user , username : username_user , num_notification };
        this.props.addToListToCall(userToCall);
    }
    render () {
        let {
            probleme_type,
            lieu,
        } = this.props.notif;
        let user = {
            username_user : this.props.notif.sender_username,
            num_app_user_user : this.props.notif.num_app_user_sender,
        };
        let {
            sender_username,
        } = this.props.notif;
        let style;
        let sumStyle ;
        let statutStyle ;
        let detailStyle ;
        switch(this.props.notif.statut_code){
            case Urgent.MAX.code :
                style = {
                    borderLeft : '13px solid red',
                    //borderRight : '3px solid red',
                };
                statutStyle = {
                    color : 'red',
                    fontWeight : 'bold',
                }
                break;

            case Urgent.MID.code :
                style = {
                    borderLeft : '13px solid yellow',
                    //borderRight : '3px solid yellow',
                };
                statutStyle = {
                    color : 'yellow',
                    fontWeight : 'bold',
                }
                break;

            case Urgent.MIN.code :
                style = {
                    borderLeft : '13px solid blue',
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
            <div className="notif" style={style} ref={this.notifRef}>
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
                        <p> Date d'envoi : </p>
                        <DateHourMinute date = {this.props.notif.date_envoie} />
                    </div>
                    <button className="myButton" onClick={this.showDetails}> Details </button>
                    <button className="myButton" onClick={this.showCommand}> repondre </button>
                </div>
                { this.state.detailsAreShown &&
                    <div className="notif-details" style={detailStyle}>
                        <p> Problème notifié : {probleme_type} </p>
                        <p> Remarque : {this.props.notif.remarque || '-'} </p>
                        <p> Lieu : {lieu} </p>
                        <p> Envoyée par : {this.props.notif.sender_username || '-'} </p>
                        <p> ID notification : {this.props.notif.num_notification} </p>
                    </div>
                }
                {
                    this.state.commandAreShown &&
                        <div className="notif-command" >
                            <button className="myButton" onClick={()=> this.do()}>prendre en charge</button>
                            <button className="myButton" onClick={() => this.do(60)}>faire patienter</button>
                            <button className="myButton" onClick={()=>this.call(user)}>Appeler</button>
                        </div>
                }
            </div>
        );
    }
}

