import './index.css';
import React from 'react';
import Intervention from './../intervention';
import Paginer from './../paginer';

/*props :
 * socket ,
 */


export default class Intervention_notification extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            interventionTab : [],
            itemPerPage : 10,
            currentPage : 1,
            maxItem : 0,//number max of annonce
        }
    }
    setPage = (newPage) => {
        console.log('setPage to', newPage);
        let {
            maxItem,
            itemPerPage,
        } = this.state;
        let maxPage = Math.ceil(maxItem/itemPerPage);
        if( newPage <= 0 || newPage > maxPage) return;
        //resend the request
        this.props.socket.emit('get list intervention_notification',this.props.session.num_user, itemPerPage, newPage);
        this.setState({
            currentPage : newPage,
        });
    }
    componentDidMount = () => {
        let {
            itemPerPage,
            currentPage,
        } = this.state;
        console.log('component did mount intervention_notification');
        this.props.socket.emit('get list intervention_notification',this.props.session.num_user, itemPerPage, currentPage);
        this.props.socket.on('list intervention_notification',(notifList, nb) => {
            console.log('list intervention' , notifList);
            let new_interventionTab = notifList.map( (item,index) => ({
                num_intervention : item.num_intervention ,
                code_intervention_type : item.code_intervention_type,
                date_programme : item.date_programme,
                libelle_lieu : item.lieu,
                libelle_intervention_type : item.libelle_intervention_type,
                tech_main_username : item.tech_main_username,
                motif : item.motif,
                numero : index + 1,
                done : item.done,
                children : item.children,
                probleme_resolu : item.probleme_resolu,
            }));
            this.setState({
                interventionTab : new_interventionTab,
                maxItem : nb,
            });
        });

        this.props.socket.on('ended intervention', () => {
            this.props.socket.emit('get list intervention_notification',this.props.session.num_user, itemPerPage, this.state.currentPage);
        });

        this.props.socket.on('notif from tech_main' , () => {
            this.props.socket.emit('get list intervention_notification',this.props.session.num_user, itemPerPage, this.state.currentPage);
        });

    }

    componentWillUnmount = () => {
        let {
            itemPerPage,
            currentPage,
        } = this.state;
        console.log('intervention_notification will unmount');
        this.props.socket.off('list intervention_notification');
        //this.props.socket.off('ended intervention'); better in interventionPage as it is always mounted until we unmmount all
    }
    render () {
        let {
            itemPerPage,
            currentPage,
            maxItem,
            interventionTab,
        } = this.state;
        const displayListInterevention = interventionTab.map( intervention => {
            
            if ( intervention.num_intervention === this.props.numSelectedIntervention ){
                return <Intervention {...this.props} intervention={intervention} key={intervention.num_intervention} selected={true}/>;
            }else{
                return <Intervention {...this.props} intervention={intervention} key={intervention.num_intervention} selected={false}/>;
            }
        });
        return (
            <div className="intervention_notification">
                <p> Interventions provenant des notifactions de {this.props.session.username}: </p>
                <div className="scroll_list">
                    {displayListInterevention}
                </div>
                <Paginer setPage={this.setPage}
                            maxPage={ Math.ceil(maxItem/itemPerPage)}
                            currentPage={currentPage}/>
            </div>
        );
    }
}
