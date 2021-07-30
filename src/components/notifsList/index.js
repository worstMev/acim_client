import './index.css';
import React from 'react';
import Notif from './../notif';
import {Urgent} from './urgent';


//affiche notification recues 
//historique des notification repondues ??
/*
 * props:
 *  - setNbNewNotif 
 */

export default class NotifsList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            unansweredNotifsList : [],
        }
    }
    displayNotif  = (list) => {
        return list.map( notif => <Notif notif={notif} key={notif.num_notification} num_user={this.props.session.num_user} socket={this.props.socket}/> );
    }

    onClickOnNotifsList = () => {
        this.props.nbNewNotificationToZero();
    }

    componentDidMount = () => {
        //no more new notif
        this.props.nbNewNotificationToZero();
        //notifs that has num_app_user_tech_main at null
        this.props.socket.emit('get notifs list unanswered');
        this.props.socket.on('unanswered notifs list' , (notifsList) => {
            //
            let newUnansweredNotifsList = notifsList.map( notif => ({
                num_notification : notif.num_notification,
                sender_username : notif.user_sender_username,
                probleme_type : notif.probleme_type,
                probleme_code : notif.code,
                statut_code : notif.statut,
                statut_libelle : notif.statut_libelle,
                lieu : notif.lieu,
                remarque : notif.remarque,
                date_envoie : new Date(notif.date_envoie).toLocaleString('fr-FR'),
                
            }));
            if(this.props.setNbNewNotif) {
                this.props.setNbNewNotif(newUnansweredNotifsList.length);
            }
            this.setState({
                unansweredNotifsList : newUnansweredNotifsList,
            });
        });

        this.props.socket.on('new notif' , (createdNotif) => {
            //created notif doesn't have the attributes to just do a push :( 
            this.props.socket.emit('get notifs list unanswered');
        });
        
        this.props.socket.on('update notifs list unanswered' , () => {
            console.log('update notifs list unanswerd');
            setTimeout( () => {
                this.props.socket.emit('get notifs list unanswered');
            },2000);
        });
    }
    componentWillUnmount = () => {
        console.log('UNMOUNT notifsList');
        this.props.socket.off('unanswered notifs list');
        this.props.socket.off('update notifs list unanswered');
    }
    render(){
        
        return (
            <div id="notifsList" onClick={this.onClickOnNotifsList}>
                <p> Notifications recues {this.props.session.username} </p>
                <div id="scroll_list-notifsList">
                    {this.displayNotif(this.state.unansweredNotifsList)}
                </div>
            </div>
        );
    }
}
