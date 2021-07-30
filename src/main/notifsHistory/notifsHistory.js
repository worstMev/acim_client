import './notifsHistory.css';
import React from 'react';
import NotifHistoryTech from './notifHistoryTech/notifHistoryTech';
import DropDown from './../../utils/dropDown';

export default class NotifsHistory extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            notifsTab : [],
            usersList : [],
            selectedUser : 'all',
        }
    }
    componentDidMount = async () => {
        console.log(' NOTIFSHISTORY did mount ');
        this.props.socket.emit('get notifs history');
        this.props.socket.on('notifs history' , (notifsTab) => {
            console.log('notification history for tech_main' , notifsTab);
            let newNotifsTab = notifsTab.map( notif => ({

                ...notif,
                statut_code : notif.statut,
                statut_libelle : notif.statut_libelle,
                remarque : notif.remarque || '-' ,
                date_envoie : new Date(notif.date_envoie).toLocaleString('fr-FR'),
                tech_main_username : notif.tech_main_username || '-',
                date_reponse : (notif.date_reponse) ? new Date(notif.date_reponse).toLocaleString('fr-FR') : '-' ,
            }));
            console.log('newNotifsTab' , newNotifsTab);
            this.setState({
                notifsTab : newNotifsTab,
            });
        });
        this.props.socket.emit('get users list');
        this.props.socket.on('users list' , (usersList) => {
            console.log('users list' , usersList );
            usersList.push({ num_user : 0 , username : 'all'});
            this.setState({
                usersList : usersList,
            });
        });
    }

    componentDidUpdate = () => {
        console.log('NOTIFSHISTORY update');
    }

    updateSelectedUser = (e) => {
        //alert('user selected is ' +e.target.value );
        if ( e.target.value !== 'all' ) this.props.socket.emit('get notifs history', e.target.value);
        else this.props.socket.emit('get notifs history');
        this.setState({
            selectedUser : e.target.value,
        });
    }

    componentWillUnmount = () => {
        this.props.socket.off('notifs history');
        this.props.socket.off('users list');
    }
    showNotifs = (notifsTab) => {
        return (
            notifsTab.map( notif => 
                <NotifHistoryTech key={notif.num_notification} notif={notif} />
            )
        );
    }
    render (){ 
        let usersOption = this.state.usersList.map( user => 
            //<option value={user.num_user} key={user.num_user}> {user.username} </option>
            ({
                key : user.num_user ,
                value : user.num_user ,
                libelle : user.username,
            })
        );
                        //<select value={this.state.selectedUser} defaultValue={this.state.usersList[this.state.usersList.length - 1 ]} onChange={this.updateSelectedUser}>
                            //{usersOption}
                        //</select>
        return (
            <div className = "notifsHistory" > 
                <div className="notifsHistory-select">
                    <p> Historiques des notifications envoyer par :  
                    </p>
                    <DropDown objArray={usersOption}  value={this.state.selectedUser} onChange={this.updateSelectedUser} />
                </div>
                <div className="notifsHistory-list">
                    { this.showNotifs(this.state.notifsTab) }
                </div>
            </div>
        );
    }
}

