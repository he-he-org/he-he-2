import moment from 'moment';

export const format = (date, format = 'LLL') => {
  return moment(date).format(format);
};
