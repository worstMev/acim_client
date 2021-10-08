import './index.css';
import React from 'react';
import {  Switch , Route , Redirect, NavLink , useRouteMatch  } from 'react-router-dom'; 
import NotifyHeader from './../notifyHeader';
import Ask from './../ask';
import History from './../history';
import InterventionNotification from './../interventionNotification';
import InterventionPage from './../interventionPage';
import AnnonceList from './../annonceList';
import AppHeader from './../appHeader';
import { mySocket } from './../../socket_io/socket_io';
import flute_notif from './../../res/son/flute_notif.wav';
import notifMessage from './../../res/son/notif1.wav';


export default class Notify extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nbNewNotifs : 0,
            notifsList : [
                
            ],
            nbNewAnnonce : 0,
            newMessageNotifs : [
                                //{
                //    date_envoie: 'date_envoie',
                //    envoyeur_username : 'from',
                //    num_app_user_envoyeur : 'num_from',
                //    num_message : 'num',
                //},

            ],
            showSub : false,
            numSelectedIntervention : null ,
        }
        this.socket = mySocket.socket;
        this.notify_notif_pop = React.createRef();
        this.message_notifs_pop = React.createRef();
        this.notifSound = new Audio(flute_notif);
        this.messageSound = new Audio(notifMessage);
        //this.sub_display = React.createRef();

    }

    nbNewNotifsPlus = (nb) => {
        console.log('new notifs ++');
        
        let newNb = nb || this.state.nbNewNotifs + 1;
        //nb if defined to be 0 needs to be a string , !('0') is true so nbNewNotifs becomes a string and may lead to some strange behaviour so parseInt is used
        newNb = parseInt(newNb);
        console.log('new notifs ', newNb);
        this.setState({
            nbNewNotifs : newNb,
        });
    }
    logOut = () => {
        this.socket.emit('disconnect all');
        this.props.logOut();
    }

    showNotif = (ref) => {
        console.log('show Notif');
        ref.current.style.top = '157px';
        setTimeout( ()=> {
            ref.current.style.top = '-1000px'
        }, 10000);
    }

    hideNotif = (ref) => {
        ref.current.style.top = '-1000px';
    }

    showSubWithInfo = (num_intervention) => {
        let newShowSub;
        if( this.state.numSelectedIntervention === num_intervention ) {
            newShowSub = !(this.state.showSub);
            num_intervention = null;
        }
        else newShowSub = true;
        this.setState({
            showSub : newShowSub,
            numSelectedIntervention : num_intervention ,
        });
    }

    componentDidMount() {
        //initialize a client socket io
        mySocket.connect( this.props.session.username , this.props.session.type_user , this.props.session.num_user );

        this.socket.on('you have to disconnect', () => {
            this.props.logOut();
        });

        this.socket.emit('get nb new annonce', this.props.session.num_user , 'notify');
        this.socket.on('nb new annonce -notify', (nbNewAnnonce) => {
            console.log('nb new annonce -notify', nbNewAnnonce);
            this.setState({
                nbNewAnnonce : nbNewAnnonce,
            });
        });

        this.socket.on('notif from tech_main' , ({tech_main_username , probleme_type , date_envoie  ,lieu ,num_notification, date_programme}) => {
            console.log('notif from tech_main' , tech_main_username , probleme_type , date_envoie  );
            let date_envoie_formatted = new Date(date_envoie).toLocaleString('fr-FR');
            //show notif saying a sentence
            const notif = {
                tech_main_username,
                probleme_type,
                lieu,
                date_envoie_formatted : date_envoie_formatted,
                date_envoie,
                date_programme : new Date(date_programme).toLocaleString('fr-FR'),
                text : `${tech_main_username} arrive pour le probleme : " ${probleme_type} " lieu : ${lieu} - notifie le ${date_envoie_formatted} `,
                key : num_notification,
            }
            let newNotifsList = this.state.notifsList.slice();
            if(newNotifsList.length > 4) newNotifsList.pop();
            newNotifsList.unshift(notif);
            newNotifsList = newNotifsList.filter( item => {
                let now_10 = new Date().getTime() - (10*60*1000);
                let date_notif = new Date(item.date_envoie).getTime();
                if(date_notif < now_10 ) return false;
                else return true;
            });
            console.log('newNotifsList', newNotifsList );
            this.showNotif(this.notify_notif_pop);
            this.notifSound.play();
            this.setState({
                notifsList : newNotifsList,
            });
        });

        this.socket.on('new annonce -notify' , (newAnnonce) => {
            console.log('new annonce -notify', newAnnonce);
            let newNewMessageNotifs = this.state.newMessageNotifs.slice();
            newNewMessageNotifs.unshift(newAnnonce);
            console.log('newNewMessageNotifs' , newNewMessageNotifs);
            newNewMessageNotifs = newNewMessageNotifs.filter( (newNotif) => {
                let now_2 = new Date().getTime() - (10*60*1000);
                let date_notif = new Date(newNotif.date_envoie).getTime();
                console.log('now_2' , now_2 );
                console.log( 'date_notif' ,date_notif); 
                console.log ( ' date_notif is more than 10 minutes old ' , date_notif < now_2 );
                if( date_notif < now_2 ) return false;
                else return true;
            });
            console.log('newNewMessageNotifs' , newNewMessageNotifs);
            this.showNotif(this.message_notifs_pop);
            this.messageSound.play();
            this.socket.emit('get nb new annonce' , this.props.session.num_user , 'notify');
            this.setState({
                newMessageNotifs : newNewMessageNotifs,
                //nbNewMessage : newNbNewMessage,
            });
        });

        this.socket.on('updateAnnonce -notify', () =>{
            console.log('updateAnnonce -notify');
            this.socket.emit('get nb new annonce', this.props.session.num_user , 'notify');
        });
    }

    componentWillUnmount () {
        console.log('unmount notify');
        this.socket.off('list problem');
        this.socket.off('list problem_statut');
        this.socket.off('list lieu');
        this.socket.off('notif from tech_main');
        this.socket.off('new annonce -notify');
        this.socket.off('nb new annonce -notify');
        this.socket.offAny();
        mySocket.disconnect();
    }

    formatNotifsList = (notifsList) => {
        return (
            notifsList.map( item => 
                <div className="notify_notif" key={item.key} onClick={()=> this.hideNotif(this.notify_notif_pop)}>
                    <p> Intervention de {item.tech_main_username} à {item.date_programme}</p>
                    <p> probleme : {item.probleme_type} -- {item.lieu} </p>
                    <p> notifiee le : {item.date_envoie_formatted} </p>
                </div>
            )
        );

    }

    openAnnonce = () => {
        console.log('open annonce');
        let { url } = this.props.match;
        this.message_notifs_pop.current.style.top = '-1000px';
        this.props.history.push(`${url}/annonce`);
    }

    render () {
        const screenWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        let {
            numSelectedIntervention,
            newMessageNotifs,
            nbNewAnnonce,
        } = this.state;
        let subStyle ;
        let tabDisplayStyle ;
        let subDisplayChildrenStyle;
        let messageNotifDisplay;
        if ( this.state.showSub ) {
            subStyle = {
                width : '45%',
            }
            if( screenWidth <= 930 ){
                subStyle = {
                    width : '100%',
                };
                tabDisplayStyle = {
                    width : '0',
                    background : 'red',
                    display : 'none',
                };
            }
           
        }else{
            subStyle = {
                background : 'black',
                width : '0px',
            };
            subDisplayChildrenStyle = {
                display : 'none',
            };
        }

        messageNotifDisplay = newMessageNotifs.map( newMs => {
            if(newMs.is_annonce){
                return <p onClick = {this.openAnnonce} 
                            className="notify_notif"
                            key={newMs.num_message}>
                        Nouvelle annonce de la DSI </p>;
            }
        });
       //                <NotifyHeader {...this.props} logOut={this.logOut} showNotif={()=>this.showNotif(this.notify_notif_pop)}/>
 
        return (
            <div className="notify_layout">
                <AppHeader session={this.props.session} 
                                logOut={this.logOut}/>
                <div className="notify_display">
                    <TabDisplay {...this.state} 
                                style={tabDisplayStyle} 
                                {...this.props} 
                                socket = {this.socket} 
                                nbNewNotifsPlus={this.nbNewNotifsPlus} 
                                showSub={this.showSubWithInfo} 
                                numSelectedIntervention={this.state.numSelectedIntervention}
                                nbNewAnnonce={nbNewAnnonce}>
                    </TabDisplay>
                    <div className="sub-display" style={subStyle}>
                        <InterventionPage  num_intervention ={this.state.numSelectedIntervention} 
                                            {...this.props} 
                                            socket={this.socket} 
                                            style={subDisplayChildrenStyle} 
                                            closeSub={()=> this.showSubWithInfo(numSelectedIntervention)}/>
                    </div>
                    <div className="notify_notif_pop" ref={this.notify_notif_pop} >
                        {this.formatNotifsList(this.state.notifsList)}
                    </div>
                    <div className="notify_notif_pop" ref={this.message_notifs_pop} >
                        {messageNotifDisplay}
                    </div>
                </div>
            </div>
        );
    }
}

function TabDisplay(props){
    let { path, url } = props.match;
    return (
            <div className="tab-display" style={props.style}>
                <nav className="notify_nav">
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/annonce`}>{ `Annonces de la DSI`}{ (props.nbNewAnnonce > 0) ? `(${props.nbNewAnnonce})` : ''}</NavLink>
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/ask`}>{ `Demande d'assistance`}</NavLink>
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/history`}>Historiques des demandes{(props.nbNewNotifs>0) ? `(${props.nbNewNotifs})`: ``}</NavLink>
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/intervention`}>Interventions</NavLink>
                </nav>
                <div className="display">
                        {props.children}
                        <Switch>
                            <Route path={`${path}/annonce`} 
                                    render= {
                                        (routeProps) => <AnnonceList 
                                                            session={props.session}
                                                            socket={props.socket} />
                                    }
                            />
                            <Route path={`${path}/ask`} render= {
                                (routeProps) =>  <Ask {...routeProps} session={props.session} socket={props.socket} nbNewNotifsPlus={props.nbNewNotifsPlus} />
                            }/>
                            <Route path={`${path}/history`} render= {
                                (routeProps) => <History {...routeProps} session={props.session} socket={props.socket} nbNewNotifsToZero={() => props.nbNewNotifsPlus('0') } showSub={props.showSub} numSelectedIntervention={props.numSelectedIntervention}/>
                            }/>
                            <Route path={`${path}/intervention`} render= {
                                (routeProps) => <InterventionNotification {...routeProps} {...props} socket={props.socket} showSub={props.showSub} numSelectedIntervention={props.numSelectedIntervention}/> 
                            }/>
                            <Redirect exact from={path} to={`${path}/ask`} />
                        </Switch>
                </div>
            </div>

    );

}
