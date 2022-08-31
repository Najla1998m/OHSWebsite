import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  isLangArabic = new Subject<boolean>();
  constructor() {}

  getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
  }

  changeCurrentLang(_lang: string) {
    localStorage.setItem('lang', _lang);
    if (_lang == 'ar') {
      this.isLangArabic.next(true);
    } else {
      this.isLangArabic.next(false);
    }
  }

  getIsLangArHandler() {
    return this.isLangArabic.asObservable();
  }
}
