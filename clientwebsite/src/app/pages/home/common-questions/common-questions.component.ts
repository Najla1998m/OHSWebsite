import { Component, OnInit } from '@angular/core';
import { CommonQuestionsService } from 'src/app/modules/core/services/common-questions.service';
import { Question } from 'src/app/modules/shared/models/question';

@Component({
  selector: 'app-common-questions',
  templateUrl: './common-questions.component.html',
  styleUrls: ['./common-questions.component.scss'],
})
export class CommonQuestionsComponent implements OnInit {
  isLoading: boolean = true;
  companiesQuestions: Question[] = [];
  providerQuestions: Question[] = [];

  constructor(private questionsService: CommonQuestionsService) {
    this.questionsService.getAllQuestion();
    this.questionsService.getUpdates().subscribe((data) => {
      let ques = data.filter((q) => q.isVisible == true);

      this.companiesQuestions = ques.filter((e) => e.questionType == '1');
      this.providerQuestions = ques.filter((e) => e.questionType == '2');

      this.isLoading = false;
    });
  }

  ngOnInit() {}
}
