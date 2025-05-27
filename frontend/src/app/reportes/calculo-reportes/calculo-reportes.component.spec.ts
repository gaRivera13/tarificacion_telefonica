import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoReportesComponent } from './calculo-reportes.component';

describe('CalculoReportesComponent', () => {
  let component: CalculoReportesComponent;
  let fixture: ComponentFixture<CalculoReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculoReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculoReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
