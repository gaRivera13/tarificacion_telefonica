import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarTraficoComponent } from './consultar-trafico.component';

describe('ConsultarTraficoComponent', () => {
  let component: ConsultarTraficoComponent;
  let fixture: ComponentFixture<ConsultarTraficoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarTraficoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarTraficoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
