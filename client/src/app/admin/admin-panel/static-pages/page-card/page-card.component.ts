import { Component, Input, OnInit } from '@angular/core';
import { StaticPage } from 'src/app/admin/models/StaticPage';
import { StaticPageService } from '../static-page.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-card',
  templateUrl: './page-card.component.html',
  styleUrls: ['./page-card.component.css'],
})
export class PageCardComponent implements OnInit {
  @Input('data') data!: StaticPage;

  constructor(private pageServ: StaticPageService, private router: Router) {}
  ngOnInit() {}

  onDelete(id: any) {
    this.pageServ.delete(id);
  }

  onEdit(id: any) {
    this.router.navigate(['/admin/admin-panel/static-pages/edit/' + id]);
  }
}
