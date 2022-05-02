import React from 'react';
import './index.css';
import { User, computeHmac } from './../../userTypes.js';
import { authenticateUsername, authenticate } from './loginData';
import logo from './../../res/logo/base_logo_4.png';

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            usernameIsValid : false,
            submittedUsername : '',
            submittedPassword : '',
        }
    }

    changeSubmittedUsername = (event) => {
       this.setState({
           submittedUsername : event.target.value,
       });
    }

    changeSubmittedPassword = (event) => {
       this.setState({
           submittedPassword : event.target.value,
       });
    }
    checkCredentials = async (event) => {
        event.preventDefault();
        if( !this.state.usernameIsValid && this.state.submittedUsername) {
            const response = await authenticateUsername(this.state.submittedUsername);
            console.log(response);
            this.setState({
                usernameIsValid : response.usernameIsValid,
            });
        }else{
            console.log('authenticate username/password');
            try{
                const response = await authenticate(this.state.submittedUsername , this.state.submittedPassword);
                console.log(response);
                if( response.isAuthenticated ){
                    this.props.setCredentials({
                        logged : true,
                        num_user : response.num_user,
                        username : response.username,
                        type_user   : response.type_user,
                    });
                    //console.log(' type_user from server '+ response.type_user);
                    let computedHash_USER = await computeHmac(User.USER.code, response.username);
                    let computedHash_ADMIN = await computeHmac(User.ADMIN.code,response.username);
                    let computedHash_TECH_MAIN = await computeHmac(User.TECH_MAIN.code, response.username);
                    if ( response.type_user === computedHash_USER ) this.props.history.push('/notify');
                    if ( response.type_user === computedHash_ADMIN ) this.props.history.push('/admin');
                    if( response.type_user === computedHash_TECH_MAIN ) this.props.history.push('/acim');
                }
            }catch(err){
                console.log('error in checkCrendentials' , err);
            }
        }
        //check for username , if valid > usernameIsValid = true , submittedUsername = username . done
        //if usernameIsValid , check for submittedUsername&&password , if valid : hitsory.push('/dashboard');
    }
    render (){
        return (
            <div className="login">
                <div>
                    <img src={logo} alt="mndpt|acim" id="logo"/>
                </div>
                <form className = "login_form" onSubmit={this.checkCredentials}>
                    { (this.state.usernameIsValid) ? 
                        <input type="password" placeholder="mot de passe" value={this.state.submittedPassword} onChange={this.changeSubmittedPassword} autoFocus={true}/>
                        :
                        <input type="text" placeholder="utilisateur" value={this.state.submittedUsername} onChange={this.changeSubmittedUsername} autoFocus={true}/>
                    }
                    <button className="my-button login-button" onClick={this.checkCredentials}> {">"} </button>
                </form>
            </div>
        );
    }
}
