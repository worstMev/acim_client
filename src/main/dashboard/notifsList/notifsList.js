import './notifsList.css';
import React from 'react';
import Notif from './notif/notif';
import {Urgent} from './urgent';

const notifsObjectList = [
    {title : '1' , ETA : '00:00' , statut : Urgent.MAX},
    {title : '2' , ETA : '00:00', statut : Urgent.MIN},
    {title : '3' , ETA : '00:00', statut : Urgent.MID},
    {title : '4' , ETA : '00:00', statut : Urgent.MAX},
    {title : '5' , ETA : '00:00', statut : Urgent.MAX},
    {title : '6' , ETA : '00:00', statut : Urgent.MIN},
    {title : '7' , ETA : '00:00', statut : Urgent.MAX},
    {title : '8' , ETA : '00:00', statut : Urgent.MID},
    {title : '9' , ETA : '00:00', statut : Urgent.MIN},
    {title : '10' , ETA : '00:00', statut : Urgent.MIN},
    {title : '11' , ETA : '00:00', statut : Urgent.MAX},
    {title : '12' , ETA : '00:00', statut : Urgent.MAX},
];
export default class NotifsList extends React.Component {
    displayNotif  = (list) => {
        return list.map( notif => <Notif notif={notif} key={notif.title}/> );
    }
    render(){
        return (
            <div id="notifsList">
                <p> Notifications recues , historiques ? </p>
                <div id="scroll_list-notifsList">
                    {this.displayNotif(notifsObjectList)}
                </div>
            </div>
        );
    }
}
