import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Questions } from 'src/app/admin/models/questions';
import Swal from 'sweetalert2';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
})
export class QuestionsComponent implements OnInit {
  questions: Questions[] = [];
  displayForm: boolean;
  questionsForm!: FormGroup;
  selected: Questions;
  questionType: any[];

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private questionsServ: QuestionsService,
    private fb: FormBuilder
  ) {
    this.questionType = [
      { name: 'professional companies', value: 1 },
      { name: 'Service Providers', value: 2 },
    ];
    this.questionsForm = this.fb.group({
      question: [
        null,
        [Validators.required, Validators.minLength(15), Validators.max(250)],
      ],
      answer: [null, [Validators.required, Validators.minLength(3)]],
      questionType: [null, Validators.required],
      isVisible: [false],
    });
  }

  ngOnInit() {
    this.questionsServ.getAll();
    this.questionsServ.getUpdates().subscribe((data) => {
      this.questions = [...data];
    });
  }

  public get Question(): FormControl {
    return this.questionsForm.get('question') as FormControl;
  }
  public get Answer(): FormControl {
    return this.questionsForm.get('answer') as FormControl;
  }
  public get IsVisible(): FormControl {
    return this.questionsForm.get('isVisible') as FormControl;
  }

  showForm(selected: Questions = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      console.log(selected);
      this.questionsForm.patchValue(this.selected);
      this.questionsForm
        .get('questionType')
        .patchValue(+this.selected.questionType);
    }
  }

  onSubmit() {
    let model = this.questionsForm.value;

    if (!this.selected && this.questionsForm.valid) {
      model.questionType = this.questionsForm.get('questionType').value;
      console.log(model);
      this.questionsServ.add(model);

      this.displayForm = false;
      this.resetForm();
    } else if (this.selected && this.questionsForm.valid) {
      model.questionType = this.questionsForm.get('questionType').value;
      this.questionsServ.edit(this.selected.id, model);
      this.displayForm = false;
      this.resetForm();
    }
  }

  onDelete(id: number) {
    this.questionsServ.delete(id);
    // Swal.fire('Deleted!', '', 'success');
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
