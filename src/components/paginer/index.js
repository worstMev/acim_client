import './index.css';
import React, { Components } from 'react';

/*
 * props :  currentPage
 * - setPage : function to change currentPage
 * - maxPage : greatest page number
 */


export default function Paginer (props) {
    let { currentPage , setPage , maxPage } = props;
    let deltaTab = [ -2,-1, 0, 1, 2, 3 ];
    let pages = new Array(5).fill(currentPage).map( (item, index) => item + deltaTab[index]).filter( item => item <= maxPage);
    let needGoBack = (currentPage > 4);
    if( pages[pages.length -1] !== maxPage ) pages.push(maxPage);
    if( needGoBack || currentPage > 1 - deltaTab[0]) pages.unshift(1);
    console.log('pages ',pages);
    let rangeDisplay = pages.map( page => {
        let dispBefore;
        let dispAfter ;
        let displayPage = page;
        if( needGoBack && page === 1 )  dispAfter = '...';
        if( page === currentPage ) displayPage = '-> '+page;
        if( page === maxPage && currentPage < maxPage-3 ) dispBefore = '...';
        if( page <= 0 || page > maxPage) return;
        return(
            <div className="page" onClick = { () => setPage(page) } key={page}>
                {dispBefore}
                <div className="box-page">
                    <p> {displayPage} </p>
                </div>
                {dispAfter}
            </div>
        );
    });
    return(
        <div className="paginer">
            <p> Page : {currentPage} </p>
            <div className="range">
                {rangeDisplay}
            </div>
        </div>
    );
}



