import './intervention_notification.css';
import React from 'react';
import Intervention from './intervention/intervention';


export default class Intervention_notification extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            interventionTab : [],
        }
    }
    componentDidMount = () => {
        console.log('component did mount intervention_notification');
        this.props.socket.emit('get list intervention_notification',this.props.session.num_user);
        this.props.socket.on('list intervention_notification',(notifList) => {
            console.log('list intervention' , notifList);
            let new_interventionTab = notifList.map( (item,index) => ({
                num_intervention : item.num_intervention ,
                date_programme : item.date_programme,
                lieu_libelle : item.lieu,
                intervention_type : item.libelle_intervention_type,
                tech_main_username : item.tech_main_username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
            }));
            this.setState({
                interventionTab : new_interventionTab,
            });
        });
        this.props.socket.on('ended intervention', () => {
            this.props.socket.emit('get list intervention_notification',this.props.session.num_user);
        });

    }

    componentWillUnmount = () => {
        console.log('intervention_notification will unmount');
        this.props.socket.off('list intervention_notification');
        //this.props.socket.off('ended intervention'); better in interventionPage as it is always mounted until we unmmount all
    }
    displayListInterevention = (list) => {
        return list.map( intervention => {
            
            if ( intervention.num_intervention === this.props.numSelectedIntervention ){
                return <Intervention {...this.props} intervention={intervention} key={intervention.num_intervention} selected={true}/>;
            }else{
                return <Intervention {...this.props} intervention={intervention} key={intervention.num_intervention} selected={false}/>;
            }
        });
    }
    render () {
        return (
            <div className="intervention_notification">
                <p> Interventions provenant des notifactions de {this.props.session.username} </p>
                <div className="scroll_list">
                    {this.displayListInterevention(this.state.interventionTab)}
                </div>
            </div>
        );
    }
}
