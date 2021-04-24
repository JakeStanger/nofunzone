import { DateTime } from 'luxon';

function formatDate(iso: string) {
  return DateTime.fromISO(iso).toFormat('dd MMMM yyyy')
}

export default formatDate;