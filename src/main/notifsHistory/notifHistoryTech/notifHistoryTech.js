import './notifHistoryTech.css';
import React from 'react';
import { Urgent } from './../../dashboard/notifsList/urgent';

export default class NotifHistoryTech extends React.Component {
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
        let statutStyle ;
        let detailStyle ;
        switch(this.props.notif.statut_code){
            case Urgent.MAX.code :
                style = {
                    borderLeft : '3px solid red',
                    //borderRight : '3px solid red',
                };
                statutStyle = {
                    //background : 'red',
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
                    //background : 'yellow',
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
                    //background : 'blue',
                    color : 'blue',

                }
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
        if(this.props.notif.num_app_user_tech_main && this.props.notif.date_reponse){
            style = {
                ...style,
                background : '#a9c8f7',
            }
        }
        return (
            <div className="notif_history" style={style} >
                <div className="notif_history-sum" style={sumStyle}>
                    <div className="probleme_type" >
                        <p> {this.props.notif.probleme_type} </p>
                        <p> {this.props.notif.code} </p>
                    </div>
                    <div className="probleme_statut" style={statutStyle}>
                        <p> {this.props.notif.statut_libelle} </p>
                        <p> {this.props.notif.lieu} </p>
                    </div>
                    <div className="user_sender_username">
                        <p> par : {this.props.notif.user_sender_username} </p>
                    </div>
                    <div className="date_envoie">
                        <p> Date d'envoie : </p>
                        <p> {this.props.notif.date_envoie} </p>
                    </div>
                    <button onClick={this.showDetails}> Details </button>
                </div>
                { this.state.detailsAreShown &&
                    <div className="notif-details" style={detailStyle}>
                        <p> remarque: {this.props.notif.remarque} </p>
                        <p> envoyee par : {this.props.notif.user_sender_username} </p>
                        <p> pris en charge par : {this.props.notif.tech_main_username}  </p>
                        <p> repondue le : {this.props.notif.date_reponse} </p>
                        <p> ID notification : {this.props.notif.num_notification} </p>
                        <p> Details 1 </p>
                    </div>
                }
            </div>
        );
    }
}
