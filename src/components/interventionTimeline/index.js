import './index.css';
import React , { Component , useState } from 'react';
import InterventionSimple from './../interventionSimple';
import { v4 as uuidv4 } from 'uuid';

/*
 * show all intervention chronologically from start to end
 * props:
 * - start local time
 * - end local time
 * - showSub to show the intervention page
 * - socket
 */
export default class InterventionTimeline extends Component{

     constructor(props){
         super(props);
         let nbDay = new Date(this.props.end).getDay() - new Date(this.props.start).getDay() + 1;
         this.state = {
             interventionList : [],
             nbDay : nbDay,
         }
     }

    componentDidMount() {
        console.log('InterventionTimeline mounted');
        let {
            session,
            start ,
            end ,
        } = this.props;
        let id = uuidv4();//id of the InterventionTimeline
        //no need to ISOString anymore
        start = new Date(new Date(start).setHours(3,0,0));//all is converted to UTC when send to server , I don't know why xD
        //but we want to keep it local , so send local+3 , converted to UTC get local ( UTC = local - 3)
        end = new Date(new Date(end).setHours(26,59,59));

        console.log('before emit ', start , end);
        this.props.socket.emit('get agenda' , start , end , session.num_user ,id );

        this.props.socket.on('agenda -interventionTimeline -'+id , (intervByDay) => {
            console.log('agenda -interventionTimeline' ,intervByDay);
            intervByDay = intervByDay.map( item => ({
                date : item.date,
                intervList : sortByHour(item.intervList),
            }));
            console.log('intervByDay' , intervByDay);
            console.log('nbDay' , this.state.nbDay);
            this.setState({
                interventionList : intervByDay,
            });
        });

        this.props.socket.on('new intervention -interventionTimeline' , () => {
            console.log('new intervention -interventionTimeline');
            this.props.socket.emit('get agenda' , start , end , session.num_user ,id );
        });
         
        this.props.socket.on('ended intervention -interventionTimeline' , () => {
            console.log('ended intervention -interventionTimeline');
            this.props.socket.emit('get agenda' , start , end , session.num_user ,id );
        });

//        this.props.socket.on('started intervention' , () => {
//            this.props.socket.emit('get agenda' ,start , end ,session.num_user);
//        });
    }

    componentWillUnmount(){
        console.log('InterventionTimeline unmount');
        this.props.socket.off('agenda -interventionTimeline');
        this.props.socket.off('new intervention -interventionTimeline');
        this.props.socket.off('ended intervention -interventionTimeline');
    }

    
    render() {
        let {
            interventionList,
        } = this.state;
        let {
            start ,
            end ,
        } = this.props;

        let daySlotElemenst = interventionList.map( day => {
            let slotElements = [];
            for ( let i = 0 ; i < 24 ; i ++ ){
                slotElements[i] = (
                    <SlotTimeLine 
                        { ... this.props}
                        key={i} 
                        start = {i} 
                        end = {i+1} 
                        date = {day.date}
                        intervList = {day.intervList[i]} 
                        showSub={this.props.showSub}/>
                );
            }
            return (
                <div className="slotDay" key={day.date}>
                    <p className="date"> { day.date }</p>
                    {slotElements}
                </div>
            );

        });
        
        return(
            <div className="interventionTimeline">
                <div className="scroll_list">
                    { daySlotElemenst }
                </div>
            </div>
        );
    }
}
function sortByHour (intervList) {
    console.log('sortByHour', intervList);
    let res = {};
    for ( let i = 0 ; i < 24 ; i++ ){
        res = {
            ... res,
            [i] : intervList.filter( interv => {
                //let _day = new Date().getDate();
                //let startHour = new Date().setHours(i,0,0);
                //let endHour = new Date().setHours(i,59,59);
                ////first modify date so it is the same day
                //let intervHour = new Date(new Date(interv.date_programme).setDate(_day)).getTime();
                //console.log( new Date(startHour) ,new Date( endHour) , new Date(intervHour) );
                //console.log( intervHour >= startHour && intervHour <= endHour);
                //if( intervHour >= startHour && intervHour <= endHour) return true;
                //else return false;
                let intervHour = new Date(interv.date_programme).getHours();
                //console.log( i , intervHour );
                return (i === intervHour);
            }),

        };
    }
    return res;
};

function SlotTimeLine (props) {
    /*
     * props: - start 
     * - end
     * - intervList
     * - showSub to open InterventionPage
     */
    let {
        start ,
        end ,
        intervList ,
        date ,
    } = props;
    //date is dd/mm/yyyy
    //so
    let [ day , month , year ] = date.split('/');
    date = new Date(`${year}-${month}-${day}`);
    //our display only shows UTC , it will reduce anything by 3 
    //let startHour = new Date().setHours(start+3,0,0,0);
    //let freeTime = new Date(startHour);
    let startHour = date.setHours(start+3,0,0,0);
    let freeTime = new Date(startHour);

    if( intervList.length ) {
        //get the max
        //normally it is the last as we use ASC in db
        let newFreeTime = new Date(new Date(intervList[intervList.length-1].date_programme).setMilliseconds(0) + 4*60*60*1000);
        console.log('newFreeTime', newFreeTime);
        freeTime = newFreeTime;
    }
    //console.log('SlotTimeLine', intervList);
    let intervElements = intervList.map( interv => 
        <InterventionSimple key={interv.num_intervention}
            intervention={interv}
            showSub={props.showSub} />
    );

    function goToCreateIntervention (state) {
        props.history.push('/acim/creer', state);
    }

    return(
        <div className ="slotTimeLine" onDoubleClick={()=> goToCreateIntervention({dateFree: {target : {value : new Date(freeTime).toISOString().replace('Z','')}}})}>
            <p className="time"> {start}H </p>
            <div className="list">
                { intervElements }
            </div>
        </div>
    );
}

