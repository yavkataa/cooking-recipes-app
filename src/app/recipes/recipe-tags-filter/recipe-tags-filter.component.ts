import {
  Component,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
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
  @Output() newTagEvent = new EventEmitter();
  private renderer: Renderer2;
  selectedTags: string[];
  constructor(renderer: Renderer2) {
    this.renderer = renderer;
    this.selectedTags = [];
  }

  selectTag(tag: any): void {
    this.newTagEvent.emit(tag);
    if (!this.selectedTags.includes(tag)) {
      this.selectedTags.push(tag);
    } else {
      const index = this.selectedTags.indexOf(tag);
      this.selectedTags.splice(index, 1);
    }
  }
}
