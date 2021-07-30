import './header.css';
import React from 'react';

export default class Header extends React.Component {
    goBack = () =>{
        this.props.history.goBack();
    }
    render () {
        return (
            <div className="header">
                { this.props.pushBack && <button onClick={this.goBack}> go back </button>}
                <h1>mptdn_acim</h1>
                <p> {this.props.session.username} </p>
                <button onClick={this.showNotif} > showNotif </button>
                <button onClick={this.props.logOut}> se deconnecter </button>
            </div>
        );
    }
}
