import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../types/Comment';
import { LocalStorageService } from '../../../local-storage.service';
import { ApiService } from '../../../api.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss'
})
export class CommentComponent {
  @Input('comment') comment: Comment;
  localStorage: LocalStorageService;
  deletingComment: boolean;
  api: ApiService;
  constructor(localStorage: LocalStorageService, api: ApiService) {
    this.localStorage = localStorage;
    this.deletingComment = false;
    this.api = api;
  }

  deleteComment(): void {
    const id = this.comment._id;
    this.api.deleteComment(id).subscribe({
      next: (result) => {
        if (window) {
          window.location.reload();
        }
      }, 
      error: (err) => {
        if (err.status == 401) {
          this.api.clearLoggedUserData();
          if (window) {
            window.location.reload();
          }
        }
      }
    })
  }
}
