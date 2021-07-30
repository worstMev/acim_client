import './index.css';
import React from 'react';

export default class ToDo extends React.Component {
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
    render () {
        let { date_programme ,
            lieu_libelle, 
            motif,
            intervention_type,
            tech_main_username,
            numero} = this.props.intervention;
        let sumStyle ;
        let detailStyle = {
            display : "none",
        };
        let toDoStyle;
        if(this.state.detailsAreShown){
            detailStyle = {
                height : "80%",
            };
            sumStyle = {
                height : "15%",
            };
            toDoStyle = {
                height : "300px",
            }

        }
       
        return (
            <div className="toDo" style={toDoStyle} >
                <div className="toDo-sum" style={sumStyle} >
                    <p> #{numero} </p>
                    <p> {new Date(date_programme).toLocaleString('fr-FR')} </p>
                    <p> {lieu_libelle} </p>
                    <p id="tache_description"> {intervention_type} </p>
                    <p id="tech_main_username"> {tech_main_username} </p>
                    <button onClick={this.showDetails}> Details </button>
                </div>
                <div className="toDo-details" style={detailStyle} >
                    <p> Type : {intervention_type} : </p>
                    <p> Motif :{motif} </p>
                    <p> Lieu : {lieu_libelle} </p>
                    <p> Crèèe par : {tech_main_username} </p>
                    <button > lancer </button>
                </div>
            </div>
        );
    }
}
/*
 *
                    <h2> {this.props.toDo.title} </h2>
                    <p> salle xxx </p>
                    <p> {this.props.toDo.ETA} </p>
                    <button onClick={this.showDetails}> Details </button>

                    <p> Details </p>
                    <p> Details 1 </p>
 */
