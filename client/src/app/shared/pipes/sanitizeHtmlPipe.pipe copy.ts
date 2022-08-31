import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
  pure: false,
})
export class SanitizeHtmlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  public transform(data: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(data);
  }
}
