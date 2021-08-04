
export function formatDate (date) {
    let day = `${date.getDate()}`;
    let month = `${date.getMonth() +1}`;
    let year = date.getFullYear();
    month = (month.length < 2) ? '0'+month : month;
    day = (day.length < 2) ? '0'+day : day;
    return `${year}-${month}-${day}`;
}

const func = {
    formatDate,
};
export default func;
