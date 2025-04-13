import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosztoktartalmaComponent } from './posztoktartalma.component';

describe('PosztoktartalmaComponent', () => {
  let component: PosztoktartalmaComponent;
  let fixture: ComponentFixture<PosztoktartalmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PosztoktartalmaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosztoktartalmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
