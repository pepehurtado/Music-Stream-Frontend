import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(value: number): string {
    if (value == null || value < 0) {
      return 'Invalid Duration';
    }
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
