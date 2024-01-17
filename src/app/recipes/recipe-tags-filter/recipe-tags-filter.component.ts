import { Component, Input, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-tags-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-tags-filter.component.html',
  styleUrl: './recipe-tags-filter.component.scss',
})
export class RecipeTagsFilterComponent {
  @Input('tags') tags: string[] = [];
  private renderer: Renderer2;
  constructor(renderer: Renderer2) {
    this.renderer = renderer;
  }

  addTag(event: Event) {
    this.renderer.addClass(event.target, 'selected');
  }
}
