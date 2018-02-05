import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplexQueryEditorComponent } from './complex-query-editor.component';

describe('ComplexQueryEditorComponent', () => {
  let component: ComplexQueryEditorComponent;
  let fixture: ComponentFixture<ComplexQueryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplexQueryEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplexQueryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
