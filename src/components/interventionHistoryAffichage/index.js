import './index.css';
import React , {Component} from 'react';
import Intervention from './../intervention';

/*
 * props :
 * -tech_main_username
 * -date_debut
 * -date_fin
 * -statut
 * -interventions
 * -maxItem
 */

export default class InterventionHistoryAffichage extends Component {
    constructor(props){
        super(props);
        this.state = {
            interventions: [],
        }
    }
    displayInterventions = (list) => {
        return list.map( item => <Intervention key={item.num_intervention} intervention={item} showSub={this.props.showSub} />);
    };
    render(){
        let {
            tech_main_username,
            statut,
            date_debut,
            date_fin,
            interventions,
            maxItem,
        } = this.props;
        let statut_text;
        let date_text;
        let tech_main_username_text;
        if(statut.done){
            if(statut.done === 'nd') statut_text = ``;
            else statut_text = `Effectuée -- ${(statut.probleme_resolu)? 'Résolu':'Non-résolu'}`;
        }else{
            //if not done then not resolu
            statut_text = `Non-effectué`;
        }
        if(date_fin === date_debut){
            date_text = date_fin;
        }else{
            date_text = `${date_debut} - ${date_fin}`;
        }
        if( tech_main_username !== 'nd' ) {
            tech_main_username_text = `par ${tech_main_username}`;
        }else{
            tech_main_username_text = '';

        }
        return(
            <div className="interventionHistoryAffichage">
                <div className="interventionHistoryAffichage-text">
                    <p> Intervention {statut_text}  {tech_main_username_text}</p>
                    <p> du {date_text}</p>
                    <p> Nombre : {maxItem} </p>
                </div>
                <div className="scroll_list">
                    {this.displayInterventions(interventions)}
                </div>
            </div>
        );
    }
}
