import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';
import { LocalStorageService } from '../../local-storage.service';
import { CommentComponent } from './comment/comment.component';
import { Comment } from '../../types/Comment';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, CommentComponent],
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

  getComments(id: string) {
    this.api.getComments(id).subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
}
