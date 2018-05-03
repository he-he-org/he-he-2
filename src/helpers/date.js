import moment from 'moment';

export const format = (dtDate, format = 'LLL'): string => {
  return moment(dtDate).format(format);
};
