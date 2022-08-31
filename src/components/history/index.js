import './index.css';
import React from 'react';
import NotifHistory from './../notifHistory';
import Paginer from './../paginer';
import { Urgent } from './../../urgent';

/*
 * props :
 * socket
 */

export default class History extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            notifsTab : [],
            itemPerPage : 10,
            currentPage : 1,
            maxItem : 0,//number max of annonce
        }
    }
    setPage = (newPage) => {
        console.log('setPage to', newPage);
        let {
            maxItem,
            itemPerPage,
        } = this.state;
        let maxPage = Math.ceil(maxItem/itemPerPage);
        if( newPage <= 0 || newPage > maxPage) return;
        //resend the request
        this.props.socket.emit('get notifs history', this.props.session.num_user , itemPerPage, newPage);
        this.setState({
            currentPage : newPage,
        });
    }
    componentDidMount = () => {
        let { 
            itemPerPage , 
            currentPage ,
        } = this.state;
        //get all history :3 or a part of it 
        this.props.socket.emit('get notifs history', this.props.session.num_user , itemPerPage, currentPage);
        this.props.socket.on('notifs history', (notifsTab ,nb) => {
            console.log('notification history', notifsTab);
            const newNotifsTab = notifsTab.map( item => ({
                num_notification : item.num_notification,
                probleme_type : item.probleme_type,
                probleme_code : item.code,
                statut_code : item.statut,
                statut_libelle : item.statut_libelle,
                lieu : item.lieu,
                remarque : item.remarque || '-',
                date_envoie : item.date_envoie,
                num_app_user_tech_main : item.num_app_user_tech_main,
                tech_main_username : item.tech_main_username || '-',
                date_reponse : item.date_reponse,
                num_intervention : item.num_intervention,
                date_programme : item.date_programme,
            }));
            this.setState({
                notifsTab : newNotifsTab,
                maxItem : nb,
            });
        });

        this.props.socket.on('notif from tech_main' , () => {
            //tech_main has taken charge of something
            console.log('notif from tech_main in history js');
            setTimeout( () => {
                console.log('notif from tech_main');
                this.props.socket.emit('get notifs history', this.props.session.num_user , itemPerPage, this.state.currentPage);
            } , 5000);
        });

        
        //get the nb of new notfis to zero
        this.props.nbNewNotifsToZero();
    }

    componentWillUnmount = () => {
        this.props.socket.off('notifs history');
    }
    render(){
        let { 
            notifsTab ,
            itemPerPage ,
            maxItem ,
            currentPage ,
        } = this.state;
        let displayNotif  = notifsTab.map( notif => 
            <NotifHistory showSub={this.props.showSub} notif={notif} key={notif.num_notification}/> 
        );
        return (
            <div id="notifsList">
                <p> Historiques des notifications envoyées par {this.props.session.username}:  </p>
                <div id="scroll_list-notifsList">
                    {displayNotif}
                </div>
                <Paginer setPage={this.setPage}
                            maxPage={ Math.ceil(maxItem/itemPerPage)}
                            currentPage={currentPage}/>
            </div>
        );
    }
}
