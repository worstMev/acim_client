import './index.css';
import React from 'react';
import Notif from './../notif';
import NotifHistory from './../notifHistory';
import {Urgent} from './urgent';
import FoldableDiv from './../foldableDiv';


//affiche notification recues 
//historique des notification repondues ??
/*
 * props:
 *  - setNbNewNotif 
 *  - socket 
 *  - nbNewNotificationToZero //not needed anymore
 */

export default class NotifsList extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            unansweredNotifsList : [],
            notifsToday : [],
        }
    }
    displayNotif  = (list) => {
        return list.map( notif => <Notif 
            notif={notif} 
            key={notif.num_notification} 
            num_user={this.props.session.num_user} 
            socket={this.props.socket} 
            deleteFromListToCall = {this.props.deleteFromListToCall}
            addToListToCall = {this.props.addToListToCall}/> );
    }


    componentDidMount = () => {
        //no more new notif
        //notifs that has num_app_user_tech_main at null
        this.props.socket.emit('get notifs list unanswered');
        this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all dated sent to server is converted in UTC ( -3) so we up it a bit

        this.props.socket.on('unanswered notifs list' , (notifsList) => {
            //
            let newUnansweredNotifsList = notifsList.map( notif => ({
                num_notification : notif.num_notification,
                sender_username : notif.user_sender_username,
                num_app_user_sender : notif.num_app_user_user,
                probleme_type : notif.probleme_type,
                probleme_code : notif.code,
                statut_code : notif.statut,
                statut_libelle : notif.statut_libelle,
                lieu : notif.lieu,
                remarque : notif.remarque,
                date_envoie : notif.date_envoie,
                
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
            this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all dated sent to server is converted in UTC ( -3) so we up it a bit
        });
        
        this.props.socket.on('update notifs list unanswered' , () => {
            console.log('update notifs list unanswerd');
            setTimeout( () => {
                this.props.socket.emit('get notifs list unanswered');
                this.props.socket.emit('get notifs today' , new Date(new Date().setHours(4,0,0)));//we need local , and all dated sent to server is converted in UTC ( -3) so we up it a bit
            },2000);
        });

        this.props.socket.on('notifs today -notifsList', (notifsToday) => {
            console.log('notifs day -notifsList' , notifsToday);
            let newNotifsToday = notifsToday.map( notif => ({
                num_notification : notif.num_notification,
                sender_username : notif.user_sender_username,
                num_app_user_sender : notif.num_app_user_user,
                probleme_type : notif.probleme_type,
                probleme_code : notif.code,
                statut_code : notif.statut,
                statut_libelle : notif.statut_libelle,
                lieu : notif.lieu,
                remarque : notif.remarque,
                date_envoie : notif.date_envoie, 
                num_app_user_tech_main : notif.num_app_user_tech_main,
                date_reponse : notif.date_reponse,
                num_intervention : notif.num_intervention,
                date_programme : notif.date_programme,
                tech_main_username : notif.tech_main_username,
            }));
            this.setState({
                notifsToday : newNotifsToday,
            });
        });
    }
    componentWillUnmount = () => {
        console.log('UNMOUNT notifsList');
        this.props.socket.off('unanswered notifs list');
        this.props.socket.off('update notifs list unanswered');
        this.props.socket.off('notifs today -notifsList');
    }
    render(){
        
        let{
            unansweredNotifsList,
            notifsToday,
        } = this.state;
        let todayNotifsElement = notifsToday.map( notif =>{
            if( notif.num_intervention ) return (<NotifHistory key={notif.num_notification} notif = {notif} />);
            else return (<Notif 
                notif={notif} 
                key={notif.num_notification} 
                num_user={this.props.session.num_user} 
                socket={this.props.socket} 
                deleteFromListToCall = {this.props.deleteFromListToCall}
                addToListToCall = {this.props.addToListToCall}/> );

        });
        let titleNonReps = `non répondue`;
        if( unansweredNotifsList.length > 1) titleNonReps += 's';
        titleNonReps += ` : ${unansweredNotifsList.length}`;
        return (
            <div id="notifsList" onClick={this.onClickOnNotifsList}>
                <p> Notifications reçues {this.props.session.username} </p>
                <div className="scroll_list">
                    <FoldableDiv title={titleNonReps}>
                        <div id="scroll_list-notifsList">
                            {this.displayNotif(this.state.unansweredNotifsList)}
                        </div>
                    </FoldableDiv>
                    <FoldableDiv title={`Notifications reçues aujourd'hui : ${notifsToday.length}`}folded={true}>
                        <div id="scroll_list-notifsList">
                            {todayNotifsElement}
                        </div>
                    </FoldableDiv>
                </div>
            </div>
        );
    }
}
