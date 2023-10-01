import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(date: string): string {
    const currentDate = new Date();
    const dateCon = new Date(date);

    // Calculate the difference in days
    const timeDiff = Math.abs(currentDate.getTime() - dateCon.getTime());
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) {
      return 'Today';
    } else if (daysDiff === 1) {
      return 'Yesterday';
    } else if (daysDiff <= 7) {
      return `${daysDiff} days ago`;
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' } as const;
      return `${dateCon.toLocaleDateString(undefined, options)}`;
    }
  }
}