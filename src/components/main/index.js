import './index.css';
import logo from './../../res/logo/base_logo_sans_texte_2.png';
import React from 'react';
import {  Switch , Route , Redirect, NavLink   } from 'react-router-dom'; 
import { mySocket } from './../../socket_io/socket_io';
import Dashboard from './../dashboard';
import NotifsHistory from './../notifsHistory';
import ToDoList from './../toDoList';
import InterventionPage from './../interventionPage';
import InterventionHistory from './../interventionHistory';
import MessagePage from './../messagePage';
import Mytask from './../mytask';
import NotifsList from './../notifsList';
import CreateIntervention from './../createIntervention';
import Agenda from './../agenda';
import AgendaTimeline from './../agendaTimeline';
import BigAgenda from './../bigAgenda';
import AnnoncePage from './../annoncePage';
import AppHeader from './../appHeader';
import RapportActivite from './../rapportActivite';
import Caller from './../caller';
import notif1 from './../../res/son/correct_notif.wav';
import notifMessage from './../../res/son/notif1.wav';

/*
 * props:
 * - logOut
 * - session
 */


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
            nbUndoneIntervention : 0,
            nbNewNotification : 0,
            nbNewMessage :0,
            nbNewAnnonce : 0,
            showSub : false,
            showNav : false,
            numSelectedIntervention : null,
            newMessageNotifs : [
                //{
                //    date_envoie: 'date_envoie',
                //    envoyeur_username : 'from',
                //    num_app_user_envoyeur : 'num_from',
                //    num_message : 'num',
                //},
                
            ],
            listToCall : [],//list of those we want to call; {username, num_user}
            showCall : false,
        };
        this.socket = mySocket.socket;
        this.popUp = React.createRef();
        this.popUpMessage = React.createRef();
        this.notifSound = new Audio(notif1);
        this.messageSound = new Audio(notifMessage);
    }

    addToListToCall = (newItem) => {
        let newListToCall = this.state.listToCall.slice();
        //only one per num_user
        if( !newListToCall.find( item => item.num_user === newItem.num_user )){
            newListToCall.push(newItem);//{num_user , username}
            console.log('addToListToCall , newListToCall ', newListToCall);
            this.setState({
                listToCall : newListToCall,
                showCall : true,
            });
        }else{
            this.setState({
                showCall : true,
            });
        }
    }

    deleteFromListToCall = (itemToDelete) => {
        let newListToCall = this.state.listToCall.slice();
        let indexToDelete = newListToCall.findIndex( item => item.num_user === itemToDelete.num_user );
        newListToCall.splice(indexToDelete,1);
        this.setState({
            listToCall : newListToCall,
        });

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
    closeSub = () => {
        this.setState({
            showSub : false,
            numSelectedIntervention : null,
        });
    }
    nbNewNotificationPlus = (nb) => {
        let newNb = nb || this.state.nbNewNotification + 1;
        newNb = parseInt(newNb);
        this.setState({
            nbNewNotification : newNb,
        });
    }

    setNbNewMessage = (nb) => {
        let newNb = parseInt(nb)
        this.setState({
            nbNewMessage : newNb,
        });
    }

    showPopUp = (ref) => {
        ref.current.style.top = "10px";
        setTimeout( () => {
            ref.current.style.top = "-1000px";
        }, 10000);

    }

    onClickNotif = () => {
        let { url } = this.props.match;
        //hide notif , and got to notification
        this.popUp.current.style.top = "-1000px";
        this.props.history.push(`${url}/notifs`);
        
    }

    logOut = () => {
        //disconnect all other socket
        this.socket.emit('disconnect all');
        this.props.logOut();
    }

    componentDidMount = () => {
        //connect socket
        console.log(' MAIN component did mount');
        mySocket.connect( this.props.session.username , this.props.session.type_user, this.props.session.num_user);

        this.socket.on('you have to disconnect', () => {
            console.log('I have to disconnect');
            this.props.logOut();
        });
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
            this.showPopUp(this.popUp);
            let newNbNewNotification = this.state.nbNewNotification + 1;
            this.socket.emit('get nb unanswered notifs');
            this.notifSound.play();
            this.setState({
                newNotifs : newNewNotifs,
                nbNewNotification : newNbNewNotification,
            })
        });

        this.socket.on('new message -main', (newMessage)=>{
            console.log('new message -main', newMessage);
            this.socket.emit('get nb new message', this.props.session.num_user);
            let newNewMessageNotifs = this.state.newMessageNotifs.slice(); 
            if( this.props.location.pathname !== '/acim/message'){
                newNewMessageNotifs.unshift(newMessage);
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
                this.showPopUp(this.popUpMessage);
            }
            //let newNbNewMessage = this.state.nbNewMessage + 1;
            this.messageSound.play();
            this.socket.emit('get nb new message', this.props.session.num_user);
            this.setState({
                newMessageNotifs : newNewMessageNotifs,
                //nbNewMessage : newNbNewMessage,
            });
        });

        this.socket.on('new annonce -main', (newAnnonce) => {
            console.log('new annonce -main', newAnnonce);
            this.socket.emit('get nb new annonce', this.props.session.num_user);
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
            this.showPopUp(this.popUpMessage);
            this.messageSound.play();
            this.setState({
                newMessageNotifs : newNewMessageNotifs,
                //nbNewMessage : newNbNewMessage,
            });
        });
        

        this.socket.emit('get nb new annonce', this.props.session.num_user);
        this.socket.on('nb new annonce -main',(nbNewAnnonce) => {
            console.log('nb new annonce', nbNewAnnonce);
            this.setState({
                nbNewAnnonce : nbNewAnnonce,
            });
        });

        this.socket.emit('get notifs list unanswered');
        this.socket.on('unanswered notifs nb', (nb) => {
            console.log('unanswered notifs nb',nb);
            this.nbNewNotificationPlus(nb);
        });

        this.socket.emit('get nb new message', this.props.session.num_user);
        this.socket.on('nb new message -main', (nbNewMessage) =>{
            console.log('nb new message -main', nbNewMessage);
            this.setState({
                nbNewMessage : nbNewMessage,
            });
        });

        this.socket.emit('get nb undone intervention', this.props.session.num_user);
        this.socket.on('nb intervention undone -main', (nb) => {
            console.log('nb intervention undone -main', nb);
            this.setState({
                nbUndoneIntervention : nb,
            });
        });

        this.socket.on('new intervention -main',(newInterv) => {
            if(newInterv.num_app_user_tech_main_creator === this.props.session.num_user){
                console.log('thats one more intervention for me');
                this.socket.emit('get nb undone intervention' , this.props.session.num_user);
            }
        });
        this.socket.on('ended intervention -main',(newInterv) => {
            if(newInterv.num_app_user_tech_main_creator === this.props.session.num_user){
                console.log('thats one less intervention for me');
                this.socket.emit('get nb undone intervention' , this.props.session.num_user);
            }
        });

        this.socket.on('updateAnnonce -main', () => {
            console.log('updateAnnonce -main');
            this.socket.emit('get nb new annonce', this.props.session.num_user);
        });
        
    }

    componentWillUnmount = () => {
        //close socket connection
        console.log('UNMOUNT main');
        this.socket.off('new notif');
        this.socket.off('nb tache undone');
        this.socket.off('unanswered notifs nb');
        this.socket.off('new message -main');
        this.socket.off('nb new message -main');
        this.socket.off('new annonce -main');
        this.socket.off('nb new annonce -main');
        this.socket.off('updateAnnonce -main');
        this.socket.off('new intervention -main');
        this.socket.off('ended intervention -main');
        this.socket.offAny();
        this.socket.removeAllListeners();
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

    onClickMessageNotif = (sender) => {
        console.log('open message' , sender);
        let { url } = this.props.match;
        //hide notif , and got to notification
        this.popUpMessage.current.style.top = "-1000px";
        this.props.history.push(`${url}/message`, sender );
    }

    onClickAnnonceNotif = () => {
        console.log('open annonce');
        let { url } = this.props.match;
        this.popUpMessage.current.style.top = "-1000px";
        this.props.history.push(`${url}/annonce`);
    }

    goToCreateIntervention = (state) => {
        this.props.history.push('/acim/creer', state);
    }

    showNewMessageNotifs = () => {
        return(
            this.state.newMessageNotifs.map( msNotif => {
                let userFrom = {
                    num_user : msNotif.num_app_user_envoyeur,
                    username : msNotif.envoyeur_username,
                }
                let is_annonce = msNotif.is_annonce;
                let display ;
                let onClickFunc;
                if( is_annonce ){
                    display = <p> Nouvelle annonce de {userFrom.username} </p>; 
                    onClickFunc = ()=> this.onClickAnnonceNotif();
                }else{
                    display = <p> Nouveau message de {userFrom.username} </p>;
                    onClickFunc = () =>this.onClickMessageNotif(userFrom);
                }
                return (
                    <div className = "notif_pop_notif" onClick={onClickFunc} key={msNotif.num_message}>
                        {display}
                    </div>
                );
            })
        );
    }
	
    showNav = () => {
        //toggle showNav state
        let newShowNav = !this.state.showNav;
        this.setState({
            showNav : newShowNav,
        });
    }
    closeNav = () => {

        if( this.state.showNav){
            this.setState({
                showNav : false,
            });
        }
    }

    render(){
        const screenWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        let { path, url } = this.props.match;
        let {
            session,
        } = this.props;
        let { 
            showSub,
            numSelectedIntervention ,
            nbUndoneIntervention,
            nbNewMessage,
            nbNewNotification,
            nbNewAnnonce ,
            showNav,
            showCall,
            listToCall,
        } = this.state;
        let displayStyle ;
        let subStyle ;
        let navStyle;
        let callListStyle;
        let callElements;
        let mainTabStyle;
        let subDisplayChildrenStyle;
        let today = new Date();
        let todayPlus28 = new Date(today.getTime() + 28*24*60*60*1000);
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
        if(screenWidth <= 930){
            //navStyle and mainTabStyle works
            if(showNav){
                navStyle = {
                    display : 'flex',
                }
            }
        }
        if(showCall){
            callListStyle = {
                top : '20px',
            };
            callElements = listToCall.map(({username , num_user}) => 
                <Caller key={num_user} 
                    socket = {this.socket}
                    session = {this.props.session}
                    deleteFromListToCall = {this.deleteFromListToCall}
                    userToCall = {{username , num_user}}/>
            );

        }
                        //<div className="logo-main">
                        //    <img src={logo} alt="mndpt|acim"/>
                        //    
                        //</div>
                        //<p> {this.props.session.username} </p>
                        //<button onClick={()=> this.showPopUp(this.popUp) }> show pop </button>
                        //<button onClick={()=> this.showPopUp(this.popUpMessage) }> show pop message </button>
                        //<button onClick={this.logOut}> se deconnecter </button>
            return (
                <div className="main_layout" >
                    <div className="notif_pop" ref={this.popUp}>
                        {this.showNewNotifs()}
                    </div>
                    <div className="notif_pop" ref={this.popUpMessage}>
                        {this.showNewMessageNotifs()}
                    </div>
                    <div className="call_list" style={callListStyle}>
                        <div className="header">
                            <p> Appels : </p>
                            <button onClick = {()=> this.setState({showCall : false})}> X </button>
                        </div>
                        <div className="scroll_list">
                            {callElements}
                        </div>
                    </div>
                    <div className="side_bt">
                        <button onClick={this.showNav}> ... </button>
                    </div>
                    <div className="header">
                        <AppHeader session={this.props.session} 
                                    logOut={this.logOut}/>
                    </div>
                    <div className="main_display">
                        <nav className="side_nav" id="main_nav" style={navStyle}>
                            <NavLink activeClassName="active_navLink"  to={`${url}/mytasknew`} onClick={this.closeSub}>Mes tâches{(nbUndoneIntervention>0) ? `(${nbUndoneIntervention})` : ''}</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/dashboard`} onClick={this.closeSub}>Tableau de bord</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/notifs`} onClick={this.closeSub}>Notifications{(nbNewNotification>0) ? `(${nbNewNotification})` : ''}</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/message`} onClick={this.closeSub}>Messages {(nbNewMessage>0) ? `(${nbNewMessage})` : ''}</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/annonce`} onClick={this.closeSub}>Annonces {(nbNewAnnonce>0) ? `(${nbNewAnnonce})` : ''}</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/agenda`} onClick={this.closeSub}>Agenda</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/creer`} onClick={this.closeSub}>Creer une intervention</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/notifsHistory`} onClick={this.closeSub}>Historiques des notifications</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/interventionHistory`} onClick={this.closeSub}>Historiques des interventions</NavLink>
                            <NavLink activeClassName="active_navLink"  to={`${url}/rapport`} onClick={this.closeSub}>{`Rapport d'activité`}</NavLink>
                        </nav>
                            <div className="main-tabDisplay" style={mainTabStyle} onClick = {this.closeNav}>
                                <div className="display" style={displayStyle}>
                                    <Switch>
                                        <Route exact path={path}> 
                                            <Redirect to={`${path}/mytasknew`}/>
                                        </Route>

                                        <Route path={`${path}/dashboard`} render= {
                                            (routeProps) => <Dashboard 
                                                                {...routeProps} 
                                                                socket={this.socket} 
                                                                session={this.props.session} 
                                                                showSub={this.showSub}
                                                                closeSub ={()=> this.showSub(numSelectedIntervention)} 
                                                                />
                                        }/>

                                        <Route path={`${path}/mytask`} 
                                                render = {
                                                    (routeProps) => <ToDoList {...routeProps} 
                                                                        {...this.props} 
                                                                        showSub={this.showSub} 
                                                                        socket={this.socket} 
                                                                        num_tech_main={session.num_user} 
                                                                        topText={`Listes des taches a faire par ${session.username} :`}
                                                                        closeSub ={()=> this.showSub(numSelectedIntervention)} 
                                                                        />

                                        }/>
                                        <Route path={`${path}/mytasknew`} 
                                                render = {
                                                    (routeProps) => <Mytask {...routeProps}
                                                    showSub = {this.showSub}
                                                    socket={this.socket}
                                                    session = {this.props.session}/>
                                        }/>

                                        <Route path={`${path}/notifs`} 
                                                render = {
                                                    (routeProps) => <NotifsList  {...routeProps} 
                                                    {...this.props} 
                                                    addToListToCall = {this.addToListToCall}
                                                    deleteFromListToCall = {this.deleteFromListToCall}
                                                    setNbNewNotif = {this.nbNewNotificationPlus}
                                                    nbNewNotificationToZero = {() => this.nbNewNotificationPlus('0')} 
                                                    socket = {this.socket}/>
                                        }/>

                                        <Route path={`${path}/notifsHistory`} 
                                                render = { (routeProps) => 
                                                    <NotifsHistory  
                                                        {...routeProps} 
                                                        session={this.props.session} 
                                                        socket={this.socket}
                                                        closeSub ={()=> this.showSub(numSelectedIntervention)} 
                                                        />
                                        }/>

                                        <Route path={`${path}/interventionHistory`} 
                                                render = { (routeProps) => 
                                                    <InterventionHistory  {...routeProps} 
                                                        session={this.props.session} 
                                                        socket={this.socket} 
                                                        showSub={this.showSub}
                                                        closeSub ={()=> this.showSub(numSelectedIntervention)} 
                                                        />
                                        }/>

                                        <Route path={`${path}/message`}
                                                render = { (routeProps) =>
                                                    <MessagePage 
                                                        session = {this.props.session}
                                                        socket={this.socket}
                                                        { ... routeProps}
                                                        setNbNewMessageToZero = { () => this.setNbNewMessage(0) }
                                                    />

                                        }/>
                                        
                                        <Route path={`${path}/annonce`}
                                                render = { (routeProps) =>
                                                     <AnnoncePage 
                                                        session = { this.props.session}
                                                        socket={this.socket} />
                                                }
                                        />
                                        <Route path={`${path}/creer`} render = {
                                            (routeProps) => <CreateIntervention {...routeProps} 
                                                {...this.props}
                                                showSub = {this.showSub}
                                                socket = {this.socket}
                                                session = {this.props.session}/>
                                        }/>

                                        <Route path= {`${path}/agenda`} render = {
                                            (routeProps) => <BigAgenda 
                                                { ... routeProps}
                                                session = { this.props.session }
                                                socket = {this.socket}
                                                showSub = {this.showSub}
                                                date_debut = { today }
                                                date_fin = { todayPlus28}
                                                close = { ()=> console.log('fermer agenda')}
                                                setSelectedDate = { (e) => this.goToCreateIntervention({dateFree : e })}//use e because we use e.target.value in createIntervention

                                            />
                                        }/>

                                        <Route path={`${path}/agendaSimple`} render = {
                                            (routeProps) => <Agenda
                                                session = { this.props.session }
                                                socket = {this.socket}
                                                showSub = {this.showSub}
                                                date_debut = { today }
                                                date_fin = { todayPlus28}
                                                close = { ()=> console.log('fermer agenda')}
                                                setSelectedDate = { (e) => this.goToCreateIntervention({dateFree : e })}//use e because we use e.target.value in createIntervention
                                                />
                                        }/>
                                        
                                        <Route path={`${path}/agendaTimeline`} render = {
                                            (routeProps) => <AgendaTimeline               
                                                { ... routeProps}
                                                session = { this.props.session }
                                                socket = {this.socket}
                                                showSub = {this.showSub}
                                                date_debut = { new Date('2021-07-01') }
                                                date_fin = { new Date('2021-08-01')}
                                                close = { ()=> console.log('fermer agenda')}
                                                />
                                        }/>

                                        <Route path={`${path}/rapport`} render = {
                                            (routeProps) => <RapportActivite 
                                                session = {this.props.session}
                                                />
                                        }/>

                                    </Switch>
                                </div>
                                <div className="sub-display" style={subStyle}>
                                    <InterventionPage 
                                        num_intervention ={this.state.numSelectedIntervention} 
                                        {...this.props}  
                                        style={subDisplayChildrenStyle} 
                                        closeSub ={()=> this.showSub(numSelectedIntervention)} 
                                        showSub = {this.showSub}
                                        socket={this.socket}
                                        />
                                </div>
                        </div>
                    </div>
                    
                </div>
            );
    }
}
                            //<NavLink activeClassName="active_navLink"  to={`${url}/agendaSimple`} onClick={this.closeSub}>Agenda _simple</NavLink>
                            //<NavLink activeClassName="active_navLink"  to={`${url}/agendaTimeline`} onClick={this.closeSub}>Agenda_timeline</NavLink>
