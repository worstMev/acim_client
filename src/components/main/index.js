import './index.css';
import React from 'react';
import {  Switch , Route , Redirect, NavLink   } from 'react-router-dom'; 
import { mySocket } from './../../socket_io/socket_io';
import Dashboard from './../dashboard';
import NotifsHistory from './../notifsHistory';
import ToDoList from './../toDoList';
import InterventionPage from './../interventionPage';
import InterventionHistory from './../interventionHistory';


export default class Main extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            newNotifs : [
                //{
                    //num_notification : 'dede',
                    //date_envoie : new Date().toLocaleString(),
                    //probleme_type : 'prb_type',
                    //probleme_statut : 'xxx',
                    //probleme_statut_code : 'MAX',
                    //lieu :'salle xxx',
                //},
            ],
            nbNewNotification : 0,
            showSub : false,
            numSelectedIntervention : null,
        };
        this.socket = mySocket.socket;
        this.popUp = React.createRef();
    }

    showSub  = (num_intervention) => {
        let newShowSub;
        if( this.state.numSelectedIntervention === num_intervention ){
            //selected intervention hasn't change
            newShowSub = !(this.state.showSub);
            num_intervention = null;

        }else newShowSub = true;
        this.setState({
            showSub : newShowSub,
            numSelectedIntervention : num_intervention,
        });
    }
    nbNewNotificationPlus = (nb) => {
        let newNb = nb || this.state.nbNewNotification + 1;
        newNb = parseInt(newNb);
        this.setState({
            nbNewNotification : newNb,
        });
    }

    showPopUp = () => {
        this.popUp.current.style.top = "10px";
        setTimeout( () => {
            this.popUp.current.style.top = "-1000px";
        }, 10000);

    }

    onClickNotif = () => {
        let { url } = this.props.match;
        //hide notif , and got to notification
        this.popUp.current.style.top = "-1000px";
        this.props.history.push(`${url}/dashboard/notifs`);
        
    }

    logOut = () => {
        this.props.logOut();
    }

    componentDidMount = () => {
        //connect socket
        console.log(' MAIN component did mount');
        mySocket.connect( this.props.session.username , this.props.session.type_user, this.props.session.num_user);
        this.socket.on('new notif' , (createdNotif) => {
            console.log('new notif received on main' , createdNotif);
            //keep in newNotifs , last 5 notifs of less than two hours
            let newNewNotifs = this.state.newNotifs.slice();
            if(newNewNotifs.length > 4) newNewNotifs.pop();
            newNewNotifs.unshift(createdNotif);
            console.log('newNewNotifs' , newNewNotifs);
            newNewNotifs = newNewNotifs.filter( (newNotif) => {
                let now_2 = new Date().getTime() - (10*60*1000);
                let date_notif = new Date(newNotif.date_envoie).getTime();
                console.log('now_2' , now_2 );
                console.log( 'date_notif' ,date_notif); 
                console.log ( ' date_notif is more than 10 minutes old ' , date_notif < now_2 );
                if( date_notif < now_2 ) return false;
                else return true;
            });
            console.log('newNewNotifs' , newNewNotifs);
            this.showPopUp();
            let newNbNewNotification = this.state.nbNewNotification + 1;
            this.setState({
                newNotifs : newNewNotifs,
                nbNewNotification : newNbNewNotification,
            })
        });
        this.socket.emit('get notifs list unanswered');
        this.socket.on('unanswered notifs nb', (nb) => {
            console.log('unanswered notifs nb',nb);
            this.nbNewNotificationPlus(nb);
        });
    }

    componentWillUnmount = () => {
        //close socket connection
        console.log('UNMOUNT main');
        this.socket.off('new notif');
        this.socket.off('nb tache undone');
        this.socket.off('unanswered notifs nb');
        this.socket.offAny();
        mySocket.socket.disconnect();
    }

    showNewNotifs = () => {
        return (
            this.state.newNotifs.map( notif => {
                let statutStyle ;
                switch (notif.probleme_statut_code){
                    case 'MAX':
                        statutStyle = {
                            color : 'red',
                        }
                        break;
                    case 'MID':
                        statutStyle = {
                            color : 'yellow',
                        }
                        break;
                    case 'MIN':
                        statutStyle = {
                            color : 'blue',
                        }
                        break;
                     default :
                        break;
                }
                return (
                    <div className = "notif_pop_notif" key={notif.num_notification} onClick={this.onClickNotif}>
                        <p id="notif_time">{new Date(notif.date_envoie).toLocaleTimeString('fr-FR')}</p>
                        <p style={statutStyle}> {notif.probleme_statut} </p>
                        <p> {notif.probleme_type} </p>
                        <p> {notif.lieu} </p>
                    </div>
                );
            })
        );
    }
	

    render(){

        let { path, url } = this.props.match;
        let {
            session,
        } = this.props;
        let { showSub,
                numSelectedIntervention ,
        } = this.state;
        let displayStyle ;
        let subStyle ;
        let subDisplayChildrenStyle;
        if(showSub){
            displayStyle = {
                ...displayStyle,
                display : 'none',
            };
            subStyle = {
                ...subStyle,
                width : '100%',
            };
        }else{
            subStyle = {
                ...subStyle,
                width : '0px',
            };
            subDisplayChildrenStyle = {
                ...subDisplayChildrenStyle,
                display : 'none',
            };
        }
            return (
                <div className="main_layout">
                    <div className="notif_pop" ref={this.popUp}>
                        {this.showNewNotifs()}
                    </div>
                    <div className="header">
                        <h1>mptdn_acim</h1>
                        <p> {this.props.session.username} </p>
                        <button onClick={this.showPopUp}> show pop </button>
                        <button onClick={this.logOut}> se deconnecter </button>
                    </div>
                    <div className="main_display">
                        <nav className="side_nav">
                            <NavLink activeClassName="active_navLink"  to={`${url}/dashboard`}>tableau de bord</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/mytask`}>Mes taches</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/notifsHistory`}>Historiques des notifications</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/interventionHistory`}>Historiques des interventions</NavLink>
                        </nav>
                            <div className="main-tabDisplay" >
                                <div className="display" style={displayStyle}>
                                    <Switch>
                                        <Route exact path={path}> 
                                            <Redirect to={`${path}/dashboard`}/>
                                        </Route>

                                        <Route path={`${path}/dashboard`} render= {
                                            (routeProps) => <Dashboard {...routeProps} socket={this.socket} session={this.props.session} nbNewNotification = {this.state.nbNewNotification}  nbNewNotificationToZero = {() => this.nbNewNotificationPlus('0')} showSub={this.showSub}/>
                                        }/>

                                        <Route path={`${path}/mytask`} 
                                                render = {
                                                    (routeProps) => <ToDoList {...routeProps} 
                                                                        {...this.props} 
                                                                        showSub={this.showSub} 
                                                                        socket={this.socket} 
                                                                        num_tech_main={session.num_user} 
                                                                        topText={`Listes des taches a faire par ${session.username} :`}
                                                                        />

                                        }/>

                                        <Route path={`${path}/notifsHistory`} 
                                                render = { (routeProps) => 
                                                    <NotifsHistory  {...routeProps} session={this.props.session} socket={this.socket}/>
                                        }/>

                                        <Route path={`${path}/interventionHistory`} 
                                                render = { (routeProps) => 
                                                    <InterventionHistory  {...routeProps} 
                                                        session={this.props.session} 
                                                        socket={this.socket} 
                                                        showSub={this.showSub}
                                                        />
                                        }/>

                                    </Switch>
                                </div>
                                <div className="sub-display" style={subStyle}>
                                    <InterventionPage num_intervention ={this.state.numSelectedIntervention} {...this.props}  style={subDisplayChildrenStyle} closeSub ={()=> this.showSub(numSelectedIntervention)} socket={this.socket}/>
                                </div>
                        </div>
                    </div>
                    
                </div>
            );
    }
}
