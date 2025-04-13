import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosztComponent } from './poszt.component';

describe('PosztComponent', () => {
  let component: PosztComponent;
  let fixture: ComponentFixture<PosztComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosztComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosztComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
