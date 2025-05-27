import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarReportesComponent } from './consultar-reportes.component';

describe('ConsultarReportesComponent', () => {
  let component: ConsultarReportesComponent;
  let fixture: ComponentFixture<ConsultarReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
