import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsService  } from './tags.service';

describe('TagsService ', () => {
  let component: TagsService ;
  let fixture: ComponentFixture<TagsService >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsService ],
    }).compileComponents();

    fixture = TestBed.createComponent(TagsService );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
