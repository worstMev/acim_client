import './index.css';
import React from 'react';
import NotifHistory from './../notifHistory';
import { Urgent } from './../../urgent';


export default class History extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            notifsTab : [],
        }
    }
    componentDidMount = () => {
        //get all history :3 or a part of it 
        this.props.socket.emit('get notifs history', this.props.session.num_user);
        this.props.socket.on('notifs history', (notifsTab) => {
            console.log('notification history', notifsTab);
            const newNotifsTab = notifsTab.map( item => ({
                num_notification : item.num_notification,
                probleme_type : item.probleme_type,
                probleme_code : item.code,
                statut_code : item.statut,
                statut_libelle : item.statut_libelle,
                lieu : item.lieu,
                remarque : item.remarque || '-',
                date_envoie : new Date(item.date_envoie).toLocaleString('fr-FR'),
                num_app_user_tech_main : item.num_app_user_tech_main,
                tech_main_username : item.tech_main_username || '-',
                date_reponse : (item.date_reponse)? new Date(item.date_reponse).toLocaleString('fr-FR'): '-',
                num_intervention : item.num_intervention || 'nd',
            }));
            this.setState({
                notifsTab : newNotifsTab,
            });
        });

        this.props.socket.on('notif from tech_main' , () => {
            //tech_main has taken charge of something
            console.log('notif from tech_main in history js');
            setTimeout( () => {
                console.log('notif from tech_main');
                this.props.socket.emit('get notifs history', this.props.session.num_user);
            } , 5000);
        });

        
        //get the nb of new notfis to zero
        this.props.nbNewNotifsToZero();
    }
    displayNotif  = (list) => {
        return list.map( notif => <NotifHistory showSub={this.props.showSub} notif={notif} key={notif.num_notification}/> );
    }

    componentWillUnmount = () => {
        this.props.socket.off('notifs history');
    }
    render(){
        return (
            <div id="notifsList">
                <p> Historiques des notifications envoyees par {this.props.session.username}:  </p>
                <div id="scroll_list-notifsList">
                    {this.displayNotif(this.state.notifsTab)}
                </div>
            </div>
        );
    }
}
