import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../types/Comment';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input('comment') comment: Comment;
}
