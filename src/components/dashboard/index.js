import './index.css';
import React from 'react';
import { NavLink , Switch , Route ,Redirect} from 'react-router-dom';
import ToDoList from './../toDoList';
import NotifsList from './../notifsList';
import CreateIntervention from './../createIntervention';
import TechActivity from './../techActivity';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nbInterventionUndone : 0,
            nbNewNotification: 0,
        }
    }


    nbInterventionUndonePlus = (nb) => {
        console.log('nbInterventionUndonePlus' ,nb)
        //let newNb = nb || this.state.nbInterventionUndone + 1 ;
        let newNb = nb;
        newNb = parseInt(newNb);
        this.setState({
            nbInterventionUndone : newNb,
        });
    }
    nbNewNotificationPlus = (nb) => {
        console.log('nbNewNotificationPlus' ,nb)
        //let newNb = nb || this.state.nbNewNotification + 1 ;
        let newNb = nb;
        newNb = parseInt(newNb);
        this.setState({
            nbNewNotification : newNb,
        });
    }
    componentDidMount= () => {
        console.log('DASHBOARD did mount');
        this.props.socket.emit('get nb intervention undone');
        this.props.socket.emit('get nb unanswered notifs');

        this.props.socket.on('nb intervention undone', (nb) => {
            console.log('nb intervention undone');
            this.setState({
                nbInterventionUndone : nb,
            });
        });

        this.props.socket.on('nb unanswered notifs -dashboard', (nb) => {
            this.setState({
                nbNewNotification : nb,
            });
        });

        this.props.socket.on('new intervention', () => {
            console.log('new intervention dashboard');
            this.props.socket.emit('get nb intervention undone');
        });

        this.props.socket.on('ended intervention', () => {
            console.log(' ended intervention dashboard');
            this.props.socket.emit('get nb intervention undone');
        });
      


        
    }
    
    componentWillUnmount = () => {
        //this.props.socket.off('new notif');
     
        this.props.socket.off('nb intervention undone');
        this.props.socket.off('new intervention ');
        this.props.socket.off('ended intervention');
        this.props.socket.off('materiel list');
        this.props.socket.off('nb unanswered notifs -dashboard');
    }
    render() {
        let { path , url } = this.props.match;
        let mainDashboardStyle ;
        return (
            <div className="dashboard">
                <div className="main-dashboard" style={mainDashboardStyle}>
                    <nav id="nav_dashboard">
                        <NavLink activeClassName="active_navLink_dashboard" to={`${url}/toDo`}> Interventions a faire {(this.state.nbInterventionUndone > 0) ? `(${this.state.nbInterventionUndone})`:''} </NavLink>
                        <NavLink activeClassName="active_navLink_dashboard" to={`${url}/tech_activity`}> Activitées </NavLink>
                        <NavLink activeClassName="active_navLink_dashboard" to={`${url}/creer`}> Creer </NavLink>
                    </nav>
                    <div id="display_dashboard">
                        <Switch>
                            <Redirect exact from={path} to={`${path}/toDo`} />
                            <Route path={`${path}/toDo`} render = {
                                (routeProps) => <ToDoList 
                                                    setNbInterventionUndone={this.nbInterventionUndonePlus}
                                                    {...routeProps} 
                                                    {...this.props} />
                             }/>
                            
                            <Route path = { `${path}/tech_activity`} 
                                    render = {
                                        (routeProps) => <TechActivity
                                                            { ... routeProps}
                                                            socket = {this.props.socket}
                                                            session = {this.props.session}
                                                            showSub = {this.props.showSub}
                                                        />
                            }/>

                            <Route path={`${path}/notifs`} render = {
                                (routeProps) => <NotifsList  {...routeProps} {...this.props} setNbNewNotif = {this.nbNewNotificationPlus} />
                            }/>

                            <Route path={`${path}/creer`} render = {
                                (routeProps) => <CreateIntervention {...routeProps} {...this.props} />
                            }/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}
