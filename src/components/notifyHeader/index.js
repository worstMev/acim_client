import './index.css';
import React from 'react';

export default class Notify_header extends React.Component {
    render () {
        return (
            <div className="notify_header header">
                <h1>mptdn_acim</h1>
                <p> {this.props.session.username} </p>
                <button onClick={this.props.showNotif} > showNotif </button>
                <button onClick={this.props.logOut}> se deconnecter </button>
            </div>
        );
    }
}
