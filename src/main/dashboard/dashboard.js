import './dashboard.css';
import React from 'react';
import { NavLink , Switch , Route ,Redirect} from 'react-router-dom';
import ToDoList from './toDoList/toDoList';
import NotifsList from './notifsList/notifsList';

export default class Dashboard extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            nbInterventionUndone : 0,
        }
    }


    nbTacheUndonePlus = (nb) => {
        let newNb = nb || this.state.nbIntereventionUndone + 1 ;
        newNb = parseInt(newNb);
        this.setState({
            nbIntereventionUndone : newNb,
        });
    }
    componentDidMount= () => {
        console.log('DASHBOARD did mount');
        this.props.socket.emit('get nb intervention undone');
        this.props.socket.on('nb intervention undone', (nb) => {
            console.log('nb intervention undone');
            this.setState({
                nbInterventionUndone : nb,
            });
        });

        this.props.socket.on('new intervention', () => {
            console.log('new intervention dashboard');
            this.props.socket.emit('get nb intervention undone');
        });
      


        
    }
    
    componentWillUnmount = () => {
        //this.props.socket.off('new notif');
        this.props.socket.off('nb intervention undone');
        this.props.socket.off('new intervention dashboard');
    }
    render() {
        let { path , url } = this.props.match;
        return (
            <div id="dashboard">
                <nav id="nav_dashboard">
                    <NavLink activeClassName="active_navLink_dashboard" to={`${url}/toDo`}> Interventions a faire {(this.state.nbInterventionUndone > 0) ? `(${this.state.nbInterventionUndone})`:''} </NavLink>
                    <NavLink activeClassName="active_navLink_dashboard" to={`${url}/notifs`}> Notifications {(this.props.nbNewNotification > 0) ? `(${this.props.nbNewNotification})`:''}</NavLink>
                    <NavLink activeClassName="active_navLink_dashboard" to={`${url}/creer`}> Creer </NavLink>
                </nav>
                <div id="display_dashboard">
                    <Switch>
                        <Redirect exact from={path} to={`${path}/toDo`} />
                        <Route path={`${path}/toDo`} render = {
                            (routeProps) => <ToDoList {...routeProps} {...this.props}  />
                         }/>

                        <Route path={`${path}/notifs`} render = {
                            (routeProps) => <NotifsList  {...routeProps} {...this.props} nbNewNotificationToZero = {this.props.nbNewNotificationToZero}/>
                        }/>

                        <Route path={`${path}/creer`}>
                            <p> creer tache a faire </p>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}
