import './index.css';
import React , { Component } from 'react';
import InterventionTimeline from './../interventionTimeline';

/*
 * props:
 * - routeProps for use of history.push
 * - session
 * - socket for getting data
 * - showSub
 * - date_debut
 * - date_fin
 * - close : to close the agenda
 */

export default class AgendaTimeline extends Component{
    constructor(props){
        super(props);
        this.state = {
            dates : [], //{date , listInterv :[{ num_intervention , date_programme : date+heure , libelle_type_type , ...}]}
            selectedInterv : {},
        }

    }
    componentDidMount(){
        console.log('AgendaTimeline did mount');
        let{
            date_debut,
            date_fin,
        } = this.props;

        this.props.socket.emit('get date stats', date_debut , date_fin , this.props.session.num_user);

        this.props.socket.on('date stats -agendaTimeline', (statsPerDate) => {
            console.log('date stats' ,statsPerDate);
            //[{date, stats :{nb_intervention}}]
            this.setState({
                dates : statsPerDate,
            });
        });
        //this.setState({
        //    dates : [
        //        { date :'30/07/2021', stats: {nb_intervention : 2}},
        //        { date : '31/07/2021' , stats : {nb_intervention : 2}}],
        //});

    }

    componentWillUnmount(){
        this.props.socket.off('date stats -agendaTimeline');
    }

    render(){
        let{
            dates,
            selectedInterv,
        } = this.state;
        let agendaElements = dates.map(item => 
            <AgendaDay key = { item.date } 
                        {... this.props}
                        date = { item.date } 
                        listInterv = {{length : item.stats.nb_intervention} } 
                        showSub = {this.props.showSub}
                        selectedInterv = { selectedInterv }
                        setSelectedInterv = {this.setSelectedInterv}
            />
        );
        return(
            <div className="agendaTimeline">
                {agendaElements}
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
        //selectedInterv,
    } = props;

    //get date in format yyyy-mm-dd
    console.log('AgendaDay' , date);
    let [ dayDD, monthMM , yearYY ] = date.split('/'); 
    console.log(dayDD, monthMM ,yearYY);
    
    let day  = new Date(`${yearYY}-${monthMM}-${dayDD}`);
    console.log('AgendaDay' , day);
    



    

    return(
        <div className="agendaDay" >
            <p> {date} : {listInterv.length} intervention{(listInterv.length > 1) ? 's':''} </p>
            <div className="listInterv-agendaDay">
                <InterventionTimeline
                    {... props}
                    session = {props.session}
                    start={ day}
                    end = { day}
                    showSub = { props.showSub }
                />
            </div>
            
        </div>
    );
}
