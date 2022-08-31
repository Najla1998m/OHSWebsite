import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Slider } from 'primeng/slider';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

interface Slide {
  id: number;
  title: string;
  images: string;
}

@Injectable({
  providedIn: 'root',
})
export class StaticSlideService {
  /**========================================================================
   **                            this is demo model
   *========================================================================**/

  Slides: { id: number; title: string; image: string }[] = [];

  update = new Subject<{ title: string; image: string }[]>();

  constructor(private http: HttpClient) {}

  getSlides() {
    this.http
      .get<any[]>(environment.apiUrl + `Setting/GetSettingInfo`)
      .subscribe((resData: any[]) => {
        console.log(resData);

        this.Slides = resData;
        this.update.next([...resData]);
      });
  }

  edit(id: any, slide: { id: number; title: string; image: string }) {
    const index = this.Slides.findIndex((s) => s.id == slide.id);
    this.Slides[index] = slide;
    console.log(this.Slides);

    this.update.next([...this.Slides]);
  }

  getUpdates() {
    return this.update.asObservable();
  }
}
