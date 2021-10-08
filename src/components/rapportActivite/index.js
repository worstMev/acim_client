import './index.css';
import React , { Component } from 'react' ;


/*
 * props:
 * - session
 */
export default class RapportActivite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date_debut : '',
            date_fin : '',
        }
    }
    getRapport = () => {
        console.log('getRapport');
        let { date_debut , date_fin } = this.state;
        let { session } = this.props;
        //get the server url , 
        const s_URL = new URL(document.location.href);
        //may not need to change port
        if(date_debut && date_fin && session.num_user){
            const m_path = `/rapportActivite/acim/${session.num_user}/${date_debut}/${date_fin}`;
            s_URL.port = 3500;
            s_URL.pathname = m_path;
            console.log('s_URL',s_URL);
            window.open(s_URL, '_blank');
        }
    }

    updateDebut = (e) => {
        console.log('updateDebut '+e.target.value);
        this.setState({
            date_debut : e.target.value,
        });
    }
    updateFin = (e) => {
        console.log('updateFin '+e.target.value);
        //must fin >= debut
        let { date_debut } = this.state;
        if( new Date(date_debut).getTime() > new Date(e.target.value).getTime() ){
            e.target.value = date_debut;
        }
        this.setState({
            date_fin : e.target.value,
        });
    }
    render(){
        let {
            session,
        } = this.props;
        let {
            date_debut,
            date_fin,
        } = this.state;
        let btText = 'Generer';
        if( date_debut && date_fin ){
            let formatted_date_debut = new Date(date_debut).toLocaleDateString('fr-FR');
            let formatted_date_fin = new Date(date_fin).toLocaleDateString('fr-FR');
            btText = `Generer rapport du ${formatted_date_debut} au ${formatted_date_fin}`;
            if(formatted_date_fin === formatted_date_debut ) btText = `Generer rapport du ${formatted_date_debut}`;
        }
        return(
            <div className="rapportActivite">
                <p> {`Rapport d'Activité de`} {session.username} </p>
                <div className="date_selector">
                    <label> Du : 
                        <input type="date" value={date_debut} onChange={this.updateDebut}/>
                    </label>
                </div>
                <div className="date_selector">
                    <label> au : 
                        <input type="date" value={date_fin} onChange={this.updateFin}/>
                    </label>
                </div>
                <button onClick={this.getRapport}> {btText} </button>
                
            </div>
        );
    }
}
