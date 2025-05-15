import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAnexosComponent } from './gestion-anexos.component';

describe('GestionAnexosComponent', () => {
  let component: GestionAnexosComponent;
  let fixture: ComponentFixture<GestionAnexosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionAnexosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionAnexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
