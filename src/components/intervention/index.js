import './index.css';
import React from 'react';
import FoldableDiv from './../foldableDiv';

/*
 * props :
 * - intervention
 * - isChild : for children of intervention
 * - showSub : to show the interventionPage of the intervention
 */
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
        let {
            isChild,
        } = this.props;
        let { date_programme ,
            num_intervention, 
            libelle_lieu,
            motif,
            intervention_type,
            libelle_intervention_type,
            tech_main_username,
            numero,
            done,
            probleme_resolu,
            libelle_probleme_tech_type,
            code_intervention_type,
            children
        } = this.props.intervention;

        let isParent = (children) &&  (children.length > 0);
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
                height : "fit-content",
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

        let childElements;
        if(children){
            childElements = children.map( (item,index) => 
                <Intervention 
                    key={item.num_intervention} 
                    intervention={item} 
                    showSub={this.props.showSub}
                    />
            );
        }

       
        return (
            <div className="toDo" style={interventionStyle} >
                <div className="toDo-sum" style={sumStyle} >
                    <p> #{numero} <br/> {code_intervention_type} <br/> {num_intervention.substring(0,8)}</p>
                    <p> {new Date(date_programme).toLocaleString('fr-FR')} </p>
                    <p> {libelle_lieu} </p>
                    <p id="tache_description"> {intervention_type || libelle_intervention_type} </p>
                    <p id="tech_main_username"> {tech_main_username} </p>
                    <p> Effectue : { (done) ? 'OUI' : 'NON' } et {(probleme_resolu) ? 'RESOLU' : 'NON-RESOLU' } </p>
                    <button onClick={this.showDetails}> Details </button>
                </div>
                <div className="toDo-details" style={detailStyle} >
                    <p> Type : {libelle_intervention_type}  </p>
                    <p> Motif : {motif} </p>
                    <p> Lieu : {libelle_lieu} </p>
                    <p> Crèèe par : {tech_main_username} </p>
                    <p> ID intervention : {num_intervention} </p>
                    <p> Probleme constaté : { libelle_probleme_tech_type} </p>
                    { isParent &&
                        <FoldableDiv title = "Suite ... " folded={true}>
                            <div className ="childList">
                                {childElements}
                            </div>
                        </FoldableDiv>
                    }
                    
                    <button onClick={() => this.goToIntervention(num_intervention)}  >
                        { (this.props.selected) ? 'Fermer' : 'Ouvrir' }
                    </button>
                </div>
            </div>
        );
    }
}
