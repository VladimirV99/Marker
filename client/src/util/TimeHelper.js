const getReadableTimeDifference = to => {
  return getReadableTimeDifferenceFrom(new Date(), to);
}

const getReadableTimeDifferenceFrom = (from, to) => {
  let sign = 1;
  let difference = (from.getTime() - to.getTime()) / 60000;
  let unit = '';

  if(difference < 0)
    sign = -1;
  difference = Math.floor(Math.abs(difference));

  if(difference < 60) {
    unit = 'minute';
  } else {
    difference = Math.round(difference / 60);
    if(difference < 24) {
      unit = 'hour';
    } else {
      difference = Math.round(difference / 24);
      if(difference < 7) {
        unit = 'day';
      } else {
        difference = Math.round(difference / 7);
        if(difference < 4) {
          unit = 'week';
        } else {
          let fromMonths = from.getFullYear() * 12 + from.getMonth();
          let toMonths = to.getFullYear() * 12 + to.getMonth();
          difference = fromMonths - toMonths;
          difference *= sign;

          if(difference > 12) {
            difference = Math.floor(difference / 12);
            unit = 'year';
          } else {
            if(sign > 0) {
              let days = to.getDate() + 30 - from.getDate();
              difference = fromMonths - toMonths - 1 + (days > 15 ? 1 : 0);
            } else {
              let days = from.getDate() + 30 - to.getDate();
              difference = fromMonths - toMonths - 1 + (days > 15 ? 1 : 0);
            }
            if(difference === 0)
              difference = 1;
            unit = 'month';
          }
        }
      }
    }
  }
  difference *= sign;

  if(Math.abs(difference) > 1)
    unit += 's';
  
  if(difference > 0) {
    return difference + ' ' + unit + ' ago';
  } else if(difference < 0) {
    return 'in ' + (-difference) + ' ' + unit;
  } else {
    return 'now';
  }
};

export { getReadableTimeDifferenceFrom, getReadableTimeDifference };