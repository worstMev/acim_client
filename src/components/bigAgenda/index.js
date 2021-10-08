import './index.css';
import React , { Component , useState} from 'react';
import Agenda from './../agenda';
import AgendaTimeline from './../agendaTimeline';

/*
 * props:
 * - session
 * - socket
 * - showSub
 * - date_debut
 * - date_fin
 * - close
 * - setSelectedDate
 */

export default function BigAgenda(props){
    let [ showTimeline , setShowTimeline ] = useState(false);

    let display;
    if(showTimeline) {
        display = <AgendaTimeline {...props}/>
    }else{
        display = <Agenda {...props} showHeader={false}/>
    }
    return(
        <div className="bigAgenda">
            <div className="control">
                <p>Agenda</p>
                <label> Details
                    <input type="checkbox" 
                        value={showTimeline} 
                        onChange ={(e)=>setShowTimeline(e.target.checked)} />
                </label>
            </div>
            <div className="display">
            {display}
            </div>
        </div>
    );
}
