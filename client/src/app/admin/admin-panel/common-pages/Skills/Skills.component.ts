import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Skill } from 'src/app/admin/models/Skill';
import { SkillsService } from './Skills.service';

@Component({
  selector: 'app-Skills',
  templateUrl: './Skills.component.html',
  styleUrls: ['./Skills.component.css'],
})
export class SkillsComponent implements OnInit {
  listSkills: Skill[] = [];
  formSkills!: FormGroup;
  displayForm!: boolean;
  selected!: Skill;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(private skillService: SkillsService, private fb: FormBuilder) {
    this.formSkills = this.fb.group({
      name: [null, Validators.required],
      isVisible: [null],
    });
  }

  ngOnInit() {
    this.skillService.getAll();
    this.skillService.getUpdates().subscribe((res) => {
      this.listSkills = [...res];
    });
  }

  public get Name(): FormControl {
    return this.formSkills.get('name') as FormControl;
  }
  public get IsVisible(): FormControl {
    return this.formSkills.get('isVisible') as FormControl;
  }

  showForm(select: Skill = null) {
    this.displayForm = true;
    this.selected = select;
    if (select) {
      this.formSkills.patchValue(this.selected);
    }
  }
  onSubmit() {
    let model = this.formSkills.value;
    if (!this.selected && this.formSkills.valid) {
      this.skillService.add(model);
      this.displayForm = false;
      this.resetForm();
    } else {
      model.id = this.selected.id;
      this.skillService.edit(this.selected.id, model);
      this.displayForm = false;
      this.resetForm();
    }
  }

  onDelete(id: number) {
    this.skillService.delete(id);
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
