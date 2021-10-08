import './index_new.css';
import vertical_dot from './../../res/icon/vertical-dots.png';
import React from 'react';
import FoldableDiv from './../foldableDiv';
import green_dot from './../../res/icon/green_dot.png';
import red_cross from './../../res/icon/cross.png';
import check from './../../res/icon/check.png';
import red_dot from './../../res/icon/red_dot.png';

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
            commentaire,
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
        let timeStyle ;
        let infoStyle;
        let detailStyle = {
            display : "none",
            height : "0",
        };
        let greenDotElement = (<img src={green_dot} />);
        let checkElement = (<img src={check} />);
        let redCrossElement = (<img src={red_cross} />);
        let redDotElement = (<img src={red_dot} />);
        let doneStyle = {
            //background : 'red',
            //width : '20px',
            //minWidth : '20px',
           // maxWidth : '20px',
            //height : 'auto',
        };
        let okStyle = {
            //background : 'red',
            //width : '20px',
            //minWidth : '20px',
            //maxWidth : '20px',
            //height : 'auto',
        };
        let doneElement  = redCrossElement;
        let pbElement  = redCrossElement;

        if(this.state.detailsAreShown){
            detailStyle = {
                height : "45%",
            };
            sumStyle = {
                //height : "65%",
            };
            interventionStyle = {
                //height : "fit-content", only -moz-fit-content works in firefox and only fit-content works in chrome
                height : "auto",
            }

        }

        if(done) {
            doneElement = checkElement;
        }
        if(probleme_resolu){
            pbElement = checkElement;
        }         

        if( this.props.selected ) {
            interventionStyle = {
                ...interventionStyle,
                background : 'rgb(169, 200, 247)',
            }
        }
        if( done ){
            if( probleme_resolu){
                infoStyle = {
                    ...infoStyle,
                };
                interventionStyle = {
                    ... interventionStyle,
                    background : '#2c9b8561',
                };
                timeStyle = {
                    ... timeStyle,
                };
                detailStyle = {
                    ...detailStyle,
                };
            }else{
                infoStyle = {
                    ...infoStyle,
                };
                interventionStyle = {
                    ... interventionStyle,
                    background : '#f3b84457',
                    border : '3px solid #f3bc4e',
                };
                timeStyle = {
                    ... timeStyle,
                };
                detailStyle = {
                    ...detailStyle,
                };
            }
        }else{
            infoStyle = {
                ...infoStyle,
                //borderLeft : '10px solid red',
            };
            interventionStyle = {
                ... interventionStyle,
                background : '#ff000069',
                border : '3px solid red',
            };
            timeStyle = {
                ... timeStyle,
            };
            detailStyle = {
                ...detailStyle,
            };
        }
        infoStyle = {
            ...infoStyle,
            //borderRadius : '0 5px 5px 0',
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

        let detailsElement = (
                <div className="toDo-details" style={detailStyle} >
                    <p> Type : {libelle_intervention_type} - {commentaire} </p>
                    <p> Motif : {motif} </p>
                    <p> Lieu : {libelle_lieu} </p>
                    <p> Crèèe par : {tech_main_username} </p>
                    <p> ID intervention : {num_intervention} </p>
                    <p> Probleme constaté : { (libelle_probleme_tech_type) ? libelle_probleme_tech_type : 'ND'} </p>
                    <p> { (done) ? 'EFFECTUE' : 'NON-EFFECTUE' } et {(probleme_resolu) ? 'RESOLU' : 'NON-RESOLU' } </p>
                    { isParent &&
                        <FoldableDiv title = "Suite ... " folded={true}>
                            <div className ="childList">
                                {childElements}
                            </div>
                        </FoldableDiv>
                    }
                    
                    <button onClick={() => this.goToIntervention(num_intervention)} className="myButton"  >
                        { (this.props.selected) ? 'Fermer' : 'Ouvrir' }
                    </button>
                </div>
        );

                    //<p> { (done) ? 'EFFECTUE' : 'NON-EFFECTUE' } et {(probleme_resolu) ? 'RESOLU' : 'NON-RESOLU' } </p>
       
        return (
            <div className="toDo" style={interventionStyle} >
                <div className="toDo-sum" style={sumStyle} >
                    <div className="time" style={timeStyle} > 
                        <div className="date">
                            {new Date(date_programme).toLocaleDateString('fr-FR')} 
                        </div>
                        <div className="hour">
                            {new Date(date_programme).toLocaleTimeString('fr-FR', {hour : '2-digit' , minute : '2-digit'})}
                        </div>
                    </div>
                    <div className="info" style={infoStyle}>
                        <div className="dots">
                            <div className="done" style={doneStyle}>
                                {doneElement}
                                <p> Effectué </p>
                            </div>
                            <div className="probleme_resolu" style={okStyle}>
                                {pbElement}
                                <p> Probleme résolue </p>
                            </div>
                        </div>
                        <div className="tache_description">
                            <p id="tache_description"> {intervention_type || libelle_intervention_type} - {libelle_lieu} </p>
                        </div>
                        <p id="tech_main_username"> {tech_main_username} </p>
                        <p> #{numero} <br/> {code_intervention_type} <br/> {num_intervention.substring(0,8)}</p>
                    </div>
                </div>
                {detailsElement}
                <div className="details-bt">
                    <button onClick={this.showDetails} className="myButton"> 
                        Details
                    </button>
                </div>
            </div>
        );
    }
}
