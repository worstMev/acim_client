import './index.css';
import React , { Component , } from 'react';
import InterventionSimple from './../interventionSimple';
/*
 * props:
 * - session
 * - socket for getting data
 * - showSub
 * - showHeader
 * - date_debut
 * - date_fin
 * - close : to close the agenda
 * - setSelectedDate : for setting a date from the agenda
 */
export default class Agenda extends Component{

    constructor(props){
        super(props);
        this.state = {
            intervByDay : [], //{date , listInterv :[{ num_intervention , date_programme : date+heure , libelle_type_type , ...}]}
            selectedInterv : {},
        }

    }
    setSelectedInterv = (interv) => {
        if( interv ){
            this.setState({
                selectedInterv : interv ,
            });
        }
    }
    componentDidMount(){
        console.log('Agenda did mount');
        let{
            date_debut,
            date_fin,
        } = this.props;

        this.props.socket.emit('get agenda', date_debut , date_fin , this.props.session.num_user);
        
        this.props.socket.on('agenda -agenda', (intervByDay) => {
            console.log('agenda -agenda', intervByDay);
            if( intervByDay.length > 0 ){
                this.setState({
                    intervByDay : intervByDay,
                });
            }
        });
    }

    setFreeDate = () => {
        let {
            setSelectedDate,
        } = this.props;
        let {
            selectedInterv,
        } = this.state;
        if( selectedInterv.num_intervention && setSelectedDate ){
            //value is in e.target.value;
            let freeTime = new Date(selectedInterv.date_programme).getTime() + (1*60*60*1000);
            console.log('free time time ', freeTime);
            freeTime = freeTime + 3*60*60*1000 ; // our display only shows UTC ... we need locale ( UTC + 3)
            freeTime = new Date(freeTime).setMilliseconds(0);
            let e = { target : { value : new Date(freeTime).toISOString().replace('Z','')}};
            console.log('free time' , e.target.value );
            if(setSelectedDate) setSelectedDate(e);
            this.props.close();
        }
    }

    
    componentWillUnmount(){
        console.log('Agenda unmount');
        this.props.socket.off('agenda -agenda');
    }
    render(){
        let{
            intervByDay,
            selectedInterv,
        } = this.state;
        let {
            showHeader,
        } = this.props;
        let agendaElements = intervByDay.map(item => 
            <AgendaDay key = { item.date } 
                        date = { item.date } 
                        listInterv = { item.intervList } 
                        showSub = {this.props.showSub}
                        selectedInterv = { selectedInterv }
                        setSelectedInterv = {this.setSelectedInterv}/>
        );
        let textDisplay = '' ;
        let headerDisplay;
        if(selectedInterv.num_intervention){
            textDisplay = (
                <p> 
                    Après {selectedInterv.libelle_intervention_type}--{selectedInterv.libelle_lieu} à {new Date(selectedInterv.date_programme).toLocaleString('fr-FR')} ?
                </p>
            );
            if( selectedInterv.num_intervention === 'nd' ){
                textDisplay = (
                    <p> 
                        {new Date(selectedInterv.date_programme).toLocaleDateString('fr-FR')} à 08:00:00 ?
                    </p>
                );
            }
        }
        if(showHeader){
            headerDisplay = (
                <div className="header-agenda">
                    <p> Agenda  </p>
                
                    {textDisplay}
                    { selectedInterv.num_intervention && this.props.setSelectedDate &&
                        <>
                            <button onClick={this.setFreeDate}> OK </button>    
                            <button onClick={()=>this.setSelectedInterv({})}> Annuler </button>    
                        </>
                    }
                    <button onClick={this.props.close}> x </button>
                </div>

            );
        }else{
            headerDisplay = (
                <div className="header-agenda">
                    {textDisplay}
                    { selectedInterv.num_intervention && this.props.setSelectedDate &&
                        <div>
                            <button onClick={this.setFreeDate}> OK </button>    
                            <button onClick={()=>this.setSelectedInterv({})}> Annuler </button>    
                        </div>
                    }
                </div>
            );
        }
        return(
            <div className="agenda">
                {headerDisplay}

                <div className="main-agenda">
                    {agendaElements}
                </div>
            </div>
        );
    }
}

function AgendaDay(props){
    /*
     * props:
     * - date 
     * - listInterv: liste des interventions pour date
     */

    //let [ selectedInterv , setSelectedInterv ] = useState({});
    let{
        date,
        listInterv,
        selectedInterv,
    } = props;

    const updateSelectedInterv = (interv) => {
        if( interv.num_intervention === selectedInterv.num_intervention ) props.setSelectedInterv({});
        else props.setSelectedInterv(interv);
    }

    const chooseDay = (day) => {
        if( listInterv.length < 1 ){
            console.log('chooseDay',day);
            //day is dd/mm/YY
            let [ dayDD, monthMM , yearYY ] = day.split('/'); 
            
            console.log('chooseDay',day , dayDD , monthMM , yearYY);
            let dayAt8  = new Date(`${yearYY}-${monthMM}-${dayDD}`).setHours(7,0,0);//we add an hour to make it freeTime
            console.log('dayAt8' ,dayAt8);
            let imaginaryInterv = {
                num_intervention : 'nd',
                libelle_intervention_type : '',
                date_programme : new Date(dayAt8),
            };
            props.setSelectedInterv(imaginaryInterv);
        }
    }

    let intervs = listInterv.map( interv =>{
        //let heure = new Date(interv.date_programme).getHours();
        let style ;
        if ( selectedInterv.num_intervention === interv.num_intervention ) {
            style = {
                background : 'blue',
                color : 'white',
            }
        }
        return(
            <div className="interv-agendaDay"  style={style}
                    key={interv.num_intervention} 
                    onClick={ () => updateSelectedInterv(interv) }> 
                    <InterventionSimple intervention = {interv} showSub={props.showSub}/>
            </div>
        );
    });

    

    return(
        <div className="agendaDay" onClick={()=>chooseDay(date)}>
            <p> {date} : {listInterv.length} intervention{(listInterv.length > 1) ? 's':''} </p>
            <div className="listInterv-agendaDay">
                {intervs}
            </div>
            
        </div>
    );
}
