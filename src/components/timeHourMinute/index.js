import './index.css';
import React , { Component } from 'react';

/*
 * props : date to make just hour and minute
 */

export default function TimeHourMinute (props) {
    let option = {
        hour : '2-digit',
        minute : '2-digit',
    };
    let date_h_m = new Date(props.date).toLocaleTimeString('fr-FR', option);
    return(
        <> 
            <span> {date_h_m} </span>
        </>
    );
}
