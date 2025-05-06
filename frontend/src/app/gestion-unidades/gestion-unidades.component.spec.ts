import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionUnidadesComponent } from './gestion-unidades.component';

describe('GestionUnidadesComponent', () => {
  let component: GestionUnidadesComponent;
  let fixture: ComponentFixture<GestionUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionUnidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
