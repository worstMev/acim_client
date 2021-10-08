import './index.css';
import React, {Component} from 'react';
import logo from './../../res/logo/base_logo_sans_texte_2.png';
import user from './../../res/icon/user.png';

/*
 * props:
 * - logout : function
 * - session
 */

export default class AppHeader extends Component {
    render(){
        return(
            <div className="appHeader">
                <div className="username">
                    <img className="user_logo" src={user} />
                    <p> {this.props.session.username} </p>
                </div>
                <div className="logo-main">
                    <img src={logo} alt="mndpt|acim"/>
                </div>
                <div className="deconnecter">
                    <button onClick={this.props.logOut} className= "myButton"> se deconnecter </button>
                </div>
            </div>

        );
    }
}
