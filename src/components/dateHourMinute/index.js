import './index.css';
import React , { Component } from 'react';

export default function DateHourMinute(props) {
    let date_h_m = 'nd';
    if(props.date){
        date_h_m = new Date(props.date).toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour : '2-digit', minute : '2-digit'});
    }
//    console.log('DateHourMinute date_h_m ', date_h_m);
    if(date_h_m === 'Invalid Date') date_h_m = 'nd';
    return (
        <>
            <span> {date_h_m} </span>
        </>
    );
}
