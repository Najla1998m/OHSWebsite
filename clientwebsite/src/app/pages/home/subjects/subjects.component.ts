import { Component, OnInit } from '@angular/core';
import { StaticPagesService } from 'src/app/modules/core/services/static-pages.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  list: any[] = [null, null, null, null];

  constructor(private staticPagesService: StaticPagesService) {}

  ngOnInit() {
    this.staticPagesService.getAllPages();
    this.staticPagesService.getUpdates().subscribe((data) => {
      this.list = [...data]
        .filter((s) => s.isVisible)
        .sort((a, b) => a.order - b.order);
    });
  }
}
