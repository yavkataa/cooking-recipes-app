import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { LocalStorageService } from '../../local-storage.service';
import { CommentComponent } from './comment/comment.component';
import { Comment } from '../../types/Comment';
import { CommentFormComponent } from './comment-form/comment-form.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, CommentComponent, CommentFormComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss',
})
export class CommentsComponent implements OnInit {
  @Input('recipeId') recipeId: string;
  comments: Comment[];
  api: ApiService;
  localStorage: LocalStorageService;
  constructor(api: ApiService, localStorage: LocalStorageService) {
    this.api = api;
    this.localStorage = localStorage;
    this.comments = [
      {
        recipeId: '',
        authorId: '',
        authorName: '',
        _id: '',
        date: new Date(),
        comment: '',
      },
    ];
  }

  ngOnInit(): void {
    this.getComments(this.recipeId);
  }

  addCommentToDisplay(comment: any) {
    this.comments.push(comment);
  }

  removeComment(id: string) {
    for (let index = 0; index < this.comments.length; index++) {
      const element = this.comments[index];
      if (element._id == id) {
        this.comments.splice(index, 1);
      }
    }
  }

  getComments(id: string) {
    this.api.loading = true;
    this.api.getComments(id).subscribe({
      next: (comments) => {
        this.api.loading = false;
        this.comments = comments;
      },
      error: (err) => {
        this.api.loading = false;
        console.log(err.error.message);
      },
    });
  }
}
