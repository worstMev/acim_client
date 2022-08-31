import './index.css';
import React from 'react';
import { Urgent } from './../../urgent';
import DateHourMinute from './../dateHourMinute';
/*
 * props:
 * - notif : probleme_type , code, statut_libelle, lieu, date_envoie, remarque, tech_main_username, date_reponse, num_notification, num_intervention , date_programme ,
 */

export default class Notif_history extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detailsAreShown : false ,
        }
    }
    showDetails = () => {
        this.setState({
            detailsAreShown : !(this.state.detailsAreShown),
        });
    }
    showInfoOf = (num_intervention) => {
        this.props.showSub(num_intervention);
    }
    render () {
        let style;
        let sumStyle ;
        let statutStyle ;
        let detailStyle ;
        switch(this.props.notif.statut_code){
            case Urgent.MAX.code :
                style = {
                    borderLeft : '3px solid red',
                    //borderRight : '3px solid red',
                };
                statutStyle = {
                    //background : 'red',
                    color : 'red',
                    fontWeight : 'bold',
                }
                break;

            case Urgent.MID.code :
                style = {
                    borderLeft : '3px solid yellow',
                    //borderRight : '3px solid yellow',
                };
                statutStyle = {
                    //background : 'yellow',
                    color : 'yellow',
                    fontWeight : 'bold',
                }
                break;

            case Urgent.MIN.code :
                style = {
                    borderLeft : '3px solid blue',
                    //borderRight : '2px solid blue',
                };
                statutStyle = {
                    //background : 'blue',
                    color : 'blue',

                }
                break;
             default :
                break;
        }
        if(this.state.detailsAreShown){
            detailStyle = {
                height : "80%",
            };
            sumStyle = {
                height : "15%",
            };
            style = {
                ...style,
                height : "300px",
            }

        }
        if(this.props.notif.num_app_user_tech_main && this.props.notif.date_reponse){
            style = {
                ...style,
                background : '#a9c8f7',
            }
        }
        let {
            probleme_type ,
            code,
            statut_libelle,
            lieu,
            date_envoie,
            remarque,
            tech_main_username,
            date_reponse,
            num_notification,
            num_intervention ,
            date_programme ,
        } = this.props.notif;
        remarque = (remarque) ? remarque : '-';
        return (
            <div className="notif_history" style={style} >
                <div className="notif_history-sum" style={sumStyle}>
                    <div className="date_envoie">
                        <p> Date d'envoi : </p>
                        <DateHourMinute date={date_envoie}/>
                    </div>
                    <div className="probleme_type" >
                        <p> {probleme_type} </p>
                        <p> {code} </p>
                    </div>
                    <div className="probleme_statut" style={statutStyle}>
                        <p> {statut_libelle} </p>
                        <p> {lieu} </p>
                    </div>
                    <button onClick={this.showDetails} className="myButton"> Details </button>
                </div>
                { this.state.detailsAreShown &&
                    <div className="notif-details" style={detailStyle}>
                        { num_intervention && 
                            <>
                            <p> Intervention de {tech_main_username} le <DateHourMinute date={date_programme}/> </p>
                            <p> ID intervention : 
                                { (num_intervention !== 'nd') &&
                                    <button href="#" onClick={() => this.showInfoOf(num_intervention)}> {num_intervention} </button>
                                }
                            </p>
                            <p> prise en charge par : {tech_main_username}  </p>
                            <p> répondue le :<DateHourMinute date={date_reponse}/> </p>
                            </>
                        }
                        <p> ID notification : {num_notification} </p>
                        <p> remarque: {remarque} </p>
                    </div>
                }
            </div>
        );
    }
}
