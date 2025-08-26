import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacienteEdicaoModal } from './paciente-edicao-modal';

describe('PacienteEdicaoModal', () => {
  let component: PacienteEdicaoModal;
  let fixture: ComponentFixture<PacienteEdicaoModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacienteEdicaoModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacienteEdicaoModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
