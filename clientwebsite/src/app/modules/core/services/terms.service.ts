import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Terms } from 'src/app/modules/shared/models/terms';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TermsService {
  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTermsBySubscriptionId(id: number) {
    return this.http.get<Terms>(
      this.url + `SubscriptionTypesTerm/GetTermsBySubscriptionTypeId/${id}`
    );
  }
}
