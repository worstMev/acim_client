import './notify.css';
import React from 'react';
import {  Switch , Route , Redirect, NavLink , useRouteMatch  } from 'react-router-dom'; 
import NotifyHeader from './notify_header/notify_header';
import Ask from './ask/ask';
import History from './history/history';
import Intervention_notification from './intervention_notification/intervention_notification';
import InterventionPage from './../interventionPage/interventionPage';
import { mySocket } from './../socket_io/socket_io';

export default class Notify extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nbNewNotifs : 0,
            notifsList : [
                
            ],
            showSub : false,
            numSelectedIntervention : null ,
        }
        this.socket = mySocket.socket;
        this.notify_notif_pop = React.createRef();
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
        this.props.logOut();
    }

    showNotif = () => {
        console.log('show Notif');
        this.notify_notif_pop.current.style.top = '157px';
        setTimeout( ()=> {
            this.notify_notif_pop.current.style.top = '-1000px'
        }, 10000);
    }

    hideNotif = () => {
        this.notify_notif_pop.current.style.top = '-1000px';
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

        this.socket.on('notif from tech_main' , ({tech_main_username , probleme_type , date_envoie , delai ,lieu ,num_notification}) => {
            console.log('notif from tech_main' , tech_main_username , probleme_type , date_envoie , delai );
            let date_envoie_formatted = new Date(date_envoie).toLocaleString('fr-FR');
            //show notif saying a sentence
            const notif = {
                tech_main_username,
                probleme_type,
                lieu,
                date_envoie_formatted : date_envoie_formatted,
                date_envoie,
                delai,
                text : `${tech_main_username} arrive pour le probleme : " ${probleme_type} " lieu : ${lieu} - notifie le ${date_envoie_formatted} -- 
                delai : ${delai}`,
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
            this.showNotif();
            this.setState({
                notifsList : newNotifsList,
            });
        });
    }

    componentWillUnmount () {
        console.log('unmount notify');
        this.socket.off('list problem');
        this.socket.off('list problem_statut');
        this.socket.off('list lieu');
        this.socket.off('notif from tech_main');
        this.socket.offAny();
        mySocket.disconnect();
    }

    formatNotifsList = (notifsList) => {
        return (
            notifsList.map( item => 
                <div className="notify_notif" key={item.key} onClick={this.hideNotif}>
                    <p> {item.tech_main_username} arrive </p>
                    <p> probleme : {item.probleme_type} -- {item.lieu} </p>
                    <p> notifiee le : {item.date_envoie_formatted} </p>
                    <p> delai : {item.delai} </p>
                </div>
            )
        );

    }

    render () {
        let subStyle ;
        if ( this.state.showSub ) {
            subStyle = {
                width : '45%',
            }
        }else{
            subStyle = {
                background : 'black',
                width : '0%',
            }
        }
        
        return (
            <div className="notify_layout">
                <NotifyHeader {...this.props} showNotif={this.showNotif}/>
                <div className="notify_display">
                    <TabDisplay {...this.state} {...this.props} socket = {this.socket} nbNewNotifsPlus={this.nbNewNotifsPlus} showSub={this.showSubWithInfo} numSelectedIntervention={this.state.numSelectedIntervention}>
                        <div className="notify_notif_pop" ref={this.notify_notif_pop} >
                            {this.formatNotifsList(this.state.notifsList)}
                        </div>
                    </TabDisplay>
                    <div className="sub-display" style={subStyle}>
                        <InterventionPage num_intervention ={this.state.numSelectedIntervention} {...this.props} socket={this.socket}/>
                    </div>
                </div>
            </div>
        );
    }
}

function TabDisplay(props){
    let { path, url } = props.match;
    return (
            <div className="tab-display">
                <nav className="notify_nav">
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/ask`}>{ `Demande d'assistance`}</NavLink>
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/history`}>Historiques des demandes{(props.nbNewNotifs>0) ? `(${props.nbNewNotifs})`: ``}</NavLink>
                    <NavLink activeClassName="active_navLink_notify" to={`${url}/intervention`}>Interventions</NavLink>
                </nav>
                <div className="display">
                        {props.children}
                        <Switch>
                            <Route path={`${path}/ask`} render= {
                                (routeProps) =>  <Ask {...routeProps} session={props.session} socket={props.socket} nbNewNotifsPlus={props.nbNewNotifsPlus} />
                            }/>
                            <Route path={`${path}/history`} render= {
                                (routeProps) => <History {...routeProps} session={props.session} socket={props.socket} nbNewNotifsToZero={() => props.nbNewNotifsPlus('0') } showSub={props.showSub} numSelectedIntervention={props.numSelectedIntervention}/>
                            }/>
                            <Route path={`${path}/intervention`} render= {
                                (routeProps) => <Intervention_notification {...routeProps} {...props} socket={props.socket} showSub={props.showSub} numSelectedIntervention={props.numSelectedIntervention}/> 
                            }/>
                            <Redirect exact from={path} to={`${path}/ask`} />
                        </Switch>
                </div>
            </div>

    );

}
