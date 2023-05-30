// list of utility functions

// function that gets date difference
export const get_difference_string = (date) => {
    const d1 = date.toDate();
    const d2 = new Date();
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
    const yearDiff = d2.getFullYear() - d1.getFullYear();
    const monthDiff = d2.getMonth() - d1.getMonth();
    const totalMonthDiff = yearDiff * 12 + monthDiff;

    if (diffDays <= 31) {
        return diffDays + " dy. ago"
    } 
    if (yearDiff > 0) {
        return yearDiff + " yr. ago"
    } 
    if (totalMonthDiff <= 12 && totalMonthDiff != 0) {
        return totalMonthDiff + " mo. ago"
    }
    return diffDays + "dy. ago"
}
