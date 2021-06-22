import './dashboard.css';
import React from 'react';
import { NavLink , Switch , Route ,Redirect} from 'react-router-dom';
import ToDoList from './toDoList/toDoList';
import NotifsList from './notifsList/notifsList';

export default class Dashboard extends React.Component{
    render() {
        let { path , url } = this.props.match;
        return (
            <div id="dashboard">
                <nav id="nav_dashboard">
                    <NavLink activeClassName="active_navLink_dashboard" to={`${url}/toDo`}> a faire </NavLink>
                    <NavLink activeClassName="active_navLink_dashboard" to={`${url}/notifs`}> Notifications</NavLink>
                    <NavLink activeClassName="active_navLink_dashboard" to={`${url}/creer`}> Creer </NavLink>
                </nav>
                <div id="display_dashboard">
                    <Switch>
                        <Redirect exact from={path} to={`${path}/toDo`} />
                        <Route path={`${path}/toDo`} component={ToDoList}/>
                        <Route path={`${path}/notifs`} component={NotifsList}/>
                        <Route path={`${path}/creer`}>
                            <p> creer tache a faire </p>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}
