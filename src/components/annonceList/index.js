import './index.css';
import React , { Component } from 'react';
import check from './../../res/icon/check.png';

/*
 * props:
 * - socket
 * 
 */

export default class AnnonceList extends Component{
    constructor(props){
        super(props);
        this.state = {
            annonces : [],
        };
        this.myScroll = React.createRef();
    }
    componentDidMount(){
        console.log('annonceList mounted');
        this.props.socket.emit('get annonce' , this.props.session.num_user);
        
        this.props.socket.on('annonces -annonceList', (annonces) => {
            console.log('annonces -annonceList', annonces);
            annonces.reverse();
            this.setState({
                annonces : annonces,
            });
            this.scrollDown();
        });

        this.props.socket.on('new annonce -annonceList', (annonce) => {
            console.log('new annonce -annonceList', annonce);
            this.props.socket.emit('get annonce' , this.props.session.num_user);
        });

        this.props.socket.on('updateAnnonce -annonceList' , () => {
            console.log('updateAnnonce -annonceList');
            this.props.socket.emit('get annonce' , this.props.session.num_user);
        });
        
    }

    scrollDown = () => {
        const scroll = this.myScroll.current;
        scroll.scrollTop = scroll.scrollHeight;
    }

    componentWillUnmount(){
        console.log('annonceList unmount');
        this.props.socket.off('annonces -annonceList');
        this.props.socket.off('new annonce -annonceList');
        this.props.socket.off('updateAnnonce -annonceList');
    }

    onClickAnnonceList = () => {
        console.log('click on annonceList');
        let unseenAnnonces = this.state.annonces.filter( annonce =>
            !annonce.date_reception 
        );
        console.log('unseen Annonces' , unseenAnnonces);
        //look for tech_main saw
        if( unseenAnnonces.length > 0 ) this.props.socket.emit('app_user saw messages', unseenAnnonces);

    }
    render(){
        let { annonces } = this.state;
        let annoncesElements;
        if( annonces.length > 0){
            annoncesElements = annonces.map( annonce =>
                <Annonce key= { annonce.num_message} annonce={ annonce } />
            );
        }else{
            annoncesElements = ( <p> Aucune annonce ... </p> );
        }
        return (
            <div className="annonceList" onClick={this.onClickAnnonceList}>
                <div className = "scroll_list" ref={this.myScroll}>
                    {annoncesElements}
                </div>
            </div>
        );
    }
}

function Annonce(props){
    /*
     * props :
     * - annonce {envoyeur_username , contenu_message , date_envoie}
     */
    let{
        envoyeur_username,
        contenu_message,
        date_envoie,
        date_reception,
    } = props.annonce;
    return(
        <div className="annonce">
            <div className="info">
            <div className="sender">
                <p> {envoyeur_username}: </p>
            </div>
            <div className="contenu">
                <p> {contenu_message} </p>
            </div>
            <div className="date">
                <p> { new Date(date_envoie).toLocaleString('fr-FR') } </p>
            </div>
            </div>
            <div className="read">
                { date_reception &&
                    //<p> { new Date(date_reception).toLocaleString('fr-FR')} </p>
                    <img src= { check} alt ="vue" />
                }
            </div>
        </div>
    );
}

