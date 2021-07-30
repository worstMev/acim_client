import './App.css';
import React from 'react';
import Login from './components/login';
import Layout from './components/layout';
import Main from './components/main';
import Notify from './components/notify';
import ProtectedRoute from './components/protectedRoute';
import {  Switch , Route , Redirect  } from 'react-router-dom'; 
import { User, computeHmac } from './userTypes.js'

class App extends React.Component {
    constructor(props){
        super(props);
        console.log('======== APP constructor');
        this.state = {
            logged : (localStorage.getItem('logged') === 'true') || false,
            num_user : localStorage.getItem('num_user') || '',
            username : localStorage.getItem('username') || '',
            type_user : localStorage.getItem('type_user')|| null,
            t_u: null,
            t_t: null,
        }
        this.computedHash_USER = null;
        this.computedHash_TECH_MAIN = null;
        console.log('constructor', this.state);
    }


    setCredentials = (cred) => {
        this.computedHash_TECH_MAIN = null;
        this.computedHash_USER = null;
        this.setState({
            logged : cred.logged,
            num_user : cred.num_user,
            username : cred.username,
            type_user : cred.type_user,
        });
    }

    logOut = () => {
        this.setCredentials ( { 
            logged : false,
            num_user : '',
            username : '' ,
            type_user : null,
        });
    }

    componentDidMount = async () => {
        //computing t_u , t_t ,
        //session is ini in constructor
        console.log('======= APP component did mount , state ' , this.state);
        let computedHash_USER;
        let computedHash_TECH_MAIN;
        let lastLogged = (localStorage.getItem('logged') === 'true');
        if( lastLogged ) {
            console.log('compute hmac for user , tech_main');
            computedHash_USER       = await computeHmac(User.USER.code, this.state.username);
            computedHash_TECH_MAIN  = await computeHmac(User.TECH_MAIN.code, this.state.username);
            console.log(' after compute ' , computedHash_USER , computedHash_TECH_MAIN);
            this.setState({
                t_u : computedHash_USER,
                t_t : computedHash_TECH_MAIN,
            });
        }
        
    }

    async shouldComponentUpdate(nextProps,nextState){
        console.log('==== APP shouldComponentUpdate  state',nextState);
        //if we go from no logged to logged , need to re-compute t_u and t_t
        if( this.state.logged !== nextState.logged ){
            console.log('compute hmac for user , tech_main');
            let computedHash_USER;
            let computedHash_TECH_MAIN;
            if( !nextState.logged ) {
                //nextState is not logged , we are disconnecting
                //no need to compute just nullify
                computedHash_USER = null;
                computedHash_TECH_MAIN = null;

            }else{
                computedHash_USER       = await computeHmac(User.USER.code,nextState.username);
                computedHash_TECH_MAIN  = await computeHmac(User.TECH_MAIN.code, nextState.username);
            }
            console.log(' after compute ' , computedHash_USER , computedHash_TECH_MAIN);
            this.setState({
                t_u : computedHash_USER,
                t_t : computedHash_TECH_MAIN,
            });
        }else{
            return true;
        }
    }

    componentDidUpdate(){
        console.log('==== APP componentDidUpdate ');
        localStorage.setItem('logged',this.state.logged);
        localStorage.setItem('num_user',this.state.num_user);
        localStorage.setItem('username', this.state.username);
        localStorage.setItem('type_user',this.state.type_user);
    }
    
    render(){
        console.log('===== APP render');
        console.log('state ', this.state);

        //function for changing redirect according to type_ser and logged
        const determineRootRedirect = () => { 
            console.log('==== determineRootRedirect function ');
            console.log( 'state in determineRootRedirect ', this.state);
            console.log(' computedhash ' , this.state.t_u , this.state.t_t);
            
            if(this.state.logged){
                console.log(' logged');
                if(this.state.type_user === this.state.t_u) return '/notify';
                if(this.state.type_user === this.state.t_t) return '/acim';
            }
            console.log('no logged');
            console.log('==== end determineRootRedirect ');
            return '/login';
        }
        const redirectTo = determineRootRedirect();
        console.log('redirectTo ' , redirectTo);

        let session;
        if(this.state.logged){
            //configure session
            session = {
                num_user : this.state.num_user,
                username : this.state.username,
                type_user : this.state.type_user,
             }
        }
        console.log('=== end of render appp');

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
                                        <Redirect to={redirectTo}/>
                                    }
                    />


                    <ProtectedRoute path="/acim"
                                    conditionIn={ () => {
                                        if(this.state.logged && this.state.type_user === this.state.t_t) return true ;
                                        else return false;
                                    }}
                                    render={ (routeProps) => 
                                        <Main { ... routeProps } session={session} logOut={this.logOut} />
                                    }
                                    redirectRender={ (routeProps) =>
                                        <Redirect to={redirectTo} />
                                    }
                    /> 
                    
                    <ProtectedRoute path="/notify"
                        conditionIn={ () => {
                            if(this.state.logged && this.state.type_user === this.state.t_u ) return true;
                            else return false;
                        }}
                        render={ (routeProps) =>
                            <Notify {... routeProps} session={session} logOut = {this.logOut}/>
                        }
                        redirectRender={ (routeProps) =>
                            <Redirect to={redirectTo} />
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
