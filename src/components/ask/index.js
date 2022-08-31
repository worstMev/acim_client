import './index.css';
import React from 'react';
import Dropdown from './../../utils/dropDown';


export default class Ask extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listProblem : [],
            listProblemStatut : [],
            listLieu : [],
            session : this.props.session,
            problem : '',
            num_probleme_type : '',
            num_probleme_statut : '',
            num_lieu : '',
            remarque : '',
            indication : ''
        }
    }
    updateProblem = (e) => {
       this.setState({
           problem : e.target.value,
       });
    }
    updateProblemType = (e) => {
       this.setState({
           num_probleme_type : e.target.value,
       });
    }
    updateProblemStatut = (e) => {
       this.setState({
           num_probleme_statut : e.target.value,
       });
    }
    updateLieu = (e) => {
       this.setState({
           num_lieu : e.target.value,
       });
    }
    updateRemarque = (e) => {
       this.setState({
           remarque : e.target.value,
       });
    }
    componentDidMount = () => {
        console.log('ask mount');
        //console.log(this.props.session);
        //get the problems
        if( this.props.socket ){
            //get probleme spec : get listProbleme , statut , Lieu
            this.props.socket.on('list problem', (listProblem) => {
                console.log('list problem in ask' , listProblem );
                let newListProblem = listProblem.map( item => {
                    return { 
                        key : item.num_probleme_type,
                        value : item.num_probleme_type,
                        libelle : item.libelle,
                        code: item.code,
                    }
                });
                this.setState({
                    listProblem : newListProblem,
                    num_probleme_type : newListProblem[0].value,
                });
            });

            this.props.socket.on('list problem_statut', (listProblemStatut) => {
                console.log(' getting list problem_statut');
                let newListProblemStatut = listProblemStatut.map( item => ({
                    key : item.num_probleme_statut,
                    value : item.num_probleme_statut,
                    libelle : item.libelle,
                }));

                this.setState({
                    listProblemStatut : newListProblemStatut,
                    num_probleme_statut : newListProblemStatut[0].value,
                });

            });

            this.props.socket.on('list lieu', (listLieu) => {
                console.log(' getting list lieu');
                let newListLieu = listLieu.map( item => ({
                    key : item.num_lieu,
                    value : item.num_lieu,
                    libelle : item.libelle,
                }));

                this.setState({
                    listLieu : newListLieu,
                    num_lieu : newListLieu[0].value,
                });
            });

            this.props.socket.on('I sent a notif', (createdNotif) => {
                //alert('notification sent', createdNotif );
                createdNotif.date_envoie = new Date(createdNotif.date_envoie).toLocaleString('fr-FR');
                console.log('new notif in history');
                this.props.nbNewNotifsPlus();
                this.setState({
                    indication : `Demande envoyée #${createdNotif.date_envoie}`,
                });
            });


            this.props.socket.emit('get problem definition');
        }else{
            console.log( ' no socket in ask');
        }

    }

    componentDidupdate = () => {
        console.log('componentDidUpdate ask');
    }

    componentWillUnmount = () => {
        console.log('unmount ask');
        this.props.socket.off('list problem');
        this.props.socket.off('list problem_statut');
        this.props.socket.off('list lieu');
        this.props.socket.off('I sent a notif');
    }

    sendNotifs = () => {
        //console.log('send notifs based on ' , this.state );
        let selectedProblemTypeCode;
        console.log('listProblem' , this.state.listProblem );
        if ( this.state.listProblem.length !== 0 ) selectedProblemTypeCode = this.state.listProblem.find( problem => problem.key === this.state.num_probleme_type).code;
        console.log(' selected problem type is ' + selectedProblemTypeCode );
        //if code is OTH , remarque is required
        if ( selectedProblemTypeCode === 'OTH' && !this.state.remarque ) {
            //alert(' Vous devez ecrire une remarque');
            this.setState({
                indication : 'Vous devez ecrire une remarque',
            });
            return;
        }
        if(this.props.session && this.state.num_lieu && this.state.num_probleme_type && this.state.num_probleme_statut ){
            //create the problem first
            let newProblem = {
                num_probleme_type : this.state.num_probleme_type,
                num_probleme_statut : this.state.num_probleme_statut,
                num_lieu : this.state.num_lieu,
                remarque : this.state.remarque,
            }
            let newNotif = {
                num_app_user_user : this.state.session.num_user,
                newProblem,
            }
            console.log('send notif ' , newNotif );
            this.props.socket.emit('notif' , newNotif );


        }
    }

    render () {
        let indicationStyle ;
        if( this.state.indication ){
            //show indication
            indicationStyle = {
                opacity : 1,
                right : 0,
            }
        }
        return (
            <div className="ask">
                <p>{ `Demande d'assistance`}</p>
                <div className="dropdown-zone">
                    <p> Probleme  : </p>
                    <Dropdown value={this.state.num_probleme_type} onChange={this.updateProblemType}  objArray={this.state.listProblem}/>
                </div>
                <div className="remarque-problem">
                    <p> remarque : </p>
                    <textarea value= {this.state.remarque} onChange={this.updateRemarque} placeholder="remarque ici" />
                </div>
                <div className="double-dropdown">
                    <div className="dropdown-zone">
                        <p> Urgence : </p>
                        <Dropdown defaultValue="xx" value={this.state.num_probleme_statut} objArray={this.state.listProblemStatut} onChange={this.updateProblemStatut}/>
                    </div>
                    <div className="dropdown-zone">
                        <p> Lieu : </p>
                        <Dropdown  value={this.state.num_lieu} objArray={this.state.listLieu} onChange={this.updateLieu} />
                    </div>
                </div>
                <button className="my-button" onClick={ this.sendNotifs }> Envoyer </button>
                <div className="indication" style={indicationStyle}> { this.state.indication } </div> 
            </div>
        );
    }
}


