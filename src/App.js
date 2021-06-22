import './App.css';
import React from 'react';
import Login from './login/login';
import Layout from './layout/layout.js';
import Main from './main/main.js';
import Notify from './notify/notify.js';
import ProtectedRoute from './protectedRoute';
import {  Switch , Route , Redirect  } from 'react-router-dom'; 
import { User, computeHmac } from './userTypes.js'

class App extends React.Component {
    constructor(props){
        super(props);
        console.log('constructor');
        this.state = {
            logged : (sessionStorage.getItem('logged') === 'true') || false,
            username : sessionStorage.getItem('username') || '',
            type_user : sessionStorage.getItem('type_user')|| null,
        }
        console.log('constructor', this.state);
    }


    setCredentials = (cred) => {
        this.setState({
            logged : cred.logged,
            username : cred.username,
            type_user : cred.type_user,
        });
    }

    logOut = () => {
        this.setCredentials ( { 
            logged : false,
            username : '' ,
            type_user : null,
        });
    }

    componentDidMount() {
        //initializing session
        console.log('component did mount');
        let lastUsername;
        let lastType_user;
        let lastLogged = (sessionStorage.getItem('logged') === 'true');
        if( lastLogged ) {
             lastUsername = sessionStorage.getItem('username');
             lastType_user = sessionStorage.getItem('type_user');
        }
        this.setState({
            logged : lastLogged,
            username : lastUsername,
            type_user : lastType_user,
        });
    }

    componentDidUpdate(){
        sessionStorage.setItem('logged',this.state.logged);
        sessionStorage.setItem('username', this.state.username);
        sessionStorage.setItem('type_user',this.state.type_user);
    }
    
    render(){
        console.log('render function of app');
        let computedHash_USER;
        let computedHash_TECH_MAIN;
        //compute the hmac of user and tech_main if logged
        ( async () => {
            if(this.state.logged){
                console.log('compute hmac for user , tech_main');
                computedHash_USER       = await computeHmac(User.USER.code, this.state.username);
                computedHash_TECH_MAIN  = await computeHmac(User.TECH_MAIN.code, this.state.username);
            }
        })();

        //function for changing redirect according to type_ser and logged
        const determineRootRedirect = () => { 
            if(this.state.logged){
                console.log(' logged');
                if(this.state.type_user === computedHash_USER) return '/notify';
                if(this.state.type_user === computedHash_TECH_MAIN) return '/acim';
            }
            console.log('no logged');
            return '/login';
        }

        let session;
        if(this.state.logged){
            //configure session
            session = {
                username : this.state.username,
                type_user : this.state.type_user,
             }
        }
        //session for test
       // session = {
       //     username : 'test',
       //     type_user : 'type_test'
       // }

        return (
        <Layout>
            <div className="App">
                <Switch>
                    <ProtectedRoute path="/login"
                                    conditionIn={ () => {
                                        if( !this.state.logged ) return true;
                                        else return false;
                                    }}
                                    render={ (routeProps) => 
                                        <Login { ... routeProps} setCredentials={this.setCredentials} />
                                    }
                                    redirectRender={ (routeProps) =>
                                        <Redirect to={determineRootRedirect()}/>
                                    }
                    />


                    <ProtectedRoute path="/acim"
                                    conditionIn={ () => {
                                        if(this.state.logged && this.state.type_user === computedHash_TECH_MAIN) return true ;
                                        else return false;
                                    }}
                                    render={ (routeProps) => 
                                        <Main { ... routeProps } session={{username : this.state.username , type_user : this.state.type_user}} logOut={this.logOut} />
                                    }
                                    redirectRender={ (routeProps) =>
                                        <Redirect to={determineRootRedirect()} />
                                    }
                    /> 
                    

                    <ProtectedRoute path="/notify"
                        conditionIn={ () => {
                            if(this.state.logged && this.state.type_user === computedHash_USER ) return true;
                            else return false;
                        }}
                        render={ (routeProps) =>
                            <Notify {... routeProps} session={session} logOut = {this.logOut}/>
                        }
                        redirectRender={ (routeProps) =>
                            <Redirect to={determineRootRedirect()} />
                        }
                    />

                    <Route path="/info">
                        <dl>
                            <dt> a.c.i.m </dt>
                            <dd> Application de Coordination des Interventions de Maintenance </dd>
                        </dl>
                    </Route>

                    <Redirect   from="/" 
                                to= "/login"/> 
                    
                </Switch>
            </div>
        </Layout>
        );
    }
}
                    //<Route path="/notify" render={ (routeProps) => <Notify {... routeProps} session={session} logOut = {this.logOut} /> }/>
export default App;
