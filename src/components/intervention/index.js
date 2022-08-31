import './index_new.css';
import vertical_dot from './../../res/icon/vertical-dots.png';
import React from 'react';
import FoldableDiv from './../foldableDiv';
import TimeHourMinute from './../timeHourMinute';
import green_dot from './../../res/icon/green_dot.png';
import red_cross from './../../res/icon/cross.png';
import check from './../../res/icon/check.png';
import red_dot from './../../res/icon/red_dot.png';

/*
 * props :
 * - intervention
 * - isChild : for children of intervention
 * - showSub : to show the interventionPage of the intervention
 * - session
 * - socket
 */
export default class Intervention extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            detailsAreShown : false ,
            participants : [],
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

    askToPartake = () => {
        let {
            num_intervention,
        } = this.props.intervention
        let {
            num_user,
        } = this.props.session;
        console.log('ask to partake num_intervention %s , num_user %s', num_intervention , num_user);
        if( num_intervention , num_user ) {
            if(this.props.socket){
                this.props.socket.emit('ask to partake', num_intervention , num_user);
            }
        }

    }

    componentDidMount() {
        console.log('intervention mounted');
        if( this.props.intervention.num_intervention ){
            const { 
                num_intervention
            } = this.props.intervention;
            if(this.props.socket){
                this.props.socket.emit(`get all participants`, num_intervention);

                this.props.socket.on(`all participants -intervention -${num_intervention}`,(participants) => {
                    console.log('all participants -intervention', participants);
                    this.setState({
                        participants : participants,
                    });
                });

                this.props.socket.on(`update participants -${num_intervention}`, () => {
                    this.props.socket.emit(`get all participants`, num_intervention);
                });

            }
        }
    }

    componentWillUnmount() {
        console.log('intervention will unmount');
        const { 
            num_intervention
        } = this.props.intervention;
        if(this.props.socket){
            this.props.socket.off(`all participants -intervention -${num_intervention}`);
            this.props.socket.off(`update participants -${num_intervention}`);
        }
    }
    render () {
        let {
            isChild,
            session,
        } = this.props;
        let { date_programme ,
            num_intervention, 
            libelle_lieu,
            motif,
            intervention_type,
            commentaire,
            libelle_intervention_type,
            tech_main_username,
            num_tech_main_creator,
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

        let isMine = true ;//to stop showing button when no session and socket in props
        if( this.props.session){
            isMine = (num_tech_main_creator === this.props.session.num_user);
        }

        let isPartaking = false;
        let pendingPartaking = false;
        let participantsDisplay ;
        if( this.state.participants ){
            if(this.props.session){
                const foundPartaker = this.state.participants.find( item => item.num_user === this.props.session.num_user);
                if( foundPartaker ) {
                    pendingPartaking = !foundPartaker.isConfirmed;
                    isPartaking = foundPartaker.isConfirmed;
                }
            }
            participantsDisplay = this.state.participants.map(part => <p key={part.num_user}> - {part.username} {part.is_confirmed ? '':'(en attente de confirmation)'} </p>);
            
        }


        let detailsElement = (
                <div className="toDo-details" style={detailStyle} >
                    <p> Type : {libelle_intervention_type} - {commentaire} </p>
                    <p> Motif : {motif} </p>
                    <p> Lieu : {libelle_lieu} </p>
                    <p> Créée par : {tech_main_username} </p>
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
                    { this.state.participants.length > 0 &&
                            <>
                                <p> Participants : </p>
                                {participantsDisplay}
                            </>
                    }
                    { !isMine && !isPartaking && !pendingPartaking &&
                            <button onClick = {this.askToPartake}> Participer </button>
                    }
                    { !isMine && pendingPartaking &&
                            <p> En attente de confirmation de {tech_main_username} </p>
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
                            <TimeHourMinute  date = {date_programme} />
                        </div>
                    </div>
                    <div className="info" style={infoStyle}>
                        <div className="dots">
                            <div className="done" style={doneStyle}>
                                {doneElement}
                                <p> Effectuée </p>
                            </div>
                            <div className="probleme_resolu" style={okStyle}>
                                {pbElement}
                                <p> Problème résolue </p>
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
