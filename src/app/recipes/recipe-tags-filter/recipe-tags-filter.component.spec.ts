import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeTagsFilterComponent } from './recipe-tags-filter.component';

describe('RecipeTagsFilterComponent', () => {
  let component: RecipeTagsFilterComponent;
  let fixture: ComponentFixture<RecipeTagsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeTagsFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeTagsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
