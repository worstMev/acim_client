import './index.css';
import React from 'react';

export default class Intervention extends React.Component {
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
    goToIntervention = (num_intervention) => {
        //alert('open /intervention/'+num_intervention);
        //this.props.history.push(`/intervention/${num_intervention}`);
        this.props.showSub(num_intervention);
    }
    render () {
        let { date_programme ,
            num_intervention,
            lieu_libelle, 
            motif,
            intervention_type,
            tech_main_username,
            numero,
            done,
            probleme_resolu,
            libelle_probleme_tech_type,
            code_intervention_type} = this.props.intervention;
        let sumStyle ;
        let interventionStyle ;
        let detailStyle = {
            display : "none",
        };
        if(this.state.detailsAreShown){
            detailStyle = {
                height : "80%",
            };
            sumStyle = {
                height : "15%",
            };
            interventionStyle = {
                height : "300px",
            }

        }
        if( this.props.selected ) {
            interventionStyle = {
                ...interventionStyle,
                background : 'rgb(169, 200, 247)',
            }
        }
        if( done ){
            interventionStyle = {
                ...interventionStyle,
                borderLeft : '5px solid green',
                borderTop : '1px solid green',
                borderBottom : '1px solid green',
                borderRight : '1px solid green',

            }
        }else{
            interventionStyle = {
                ...interventionStyle,
                borderLeft : '5px solid red',
            }
        }
        interventionStyle = {
            ...interventionStyle,
            borderRadius : '0 5px 5px 0',
        }

       
        return (
            <div className="toDo" style={interventionStyle} >
                <div className="toDo-sum" style={sumStyle} >
                    <p> #{numero} <br/> {code_intervention_type}</p>
                    <p> {new Date(date_programme).toLocaleString('fr-FR')} </p>
                    <p> {lieu_libelle} </p>
                    <p id="tache_description"> {intervention_type} </p>
                    <p id="tech_main_username"> {tech_main_username} </p>
                    <p> Effectue : { (done) ? 'OUI' : 'NON' } et {(probleme_resolu) ? 'RESOLU' : 'NON-RESOLU' } </p>
                    <button onClick={this.showDetails}> Details </button>
                </div>
                <div className="toDo-details" style={detailStyle} >
                    <p> Type : {intervention_type}  </p>
                    <p> Motif : {motif} </p>
                    <p> Lieu : {lieu_libelle} </p>
                    <p> Crèèe par : {tech_main_username} </p>
                    <p> ID intervention : {num_intervention} </p>
                    <p> Probleme constaté : { libelle_probleme_tech_type} </p>
                    <button onClick={() => this.goToIntervention(num_intervention)}  >
                        { (this.props.selected) ? 'Fermer' : 'Ouvrir' }
                    </button>
                </div>
            </div>
        );
    }
}
