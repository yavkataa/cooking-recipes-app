import { Component, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../api.service';
import { LocalStorageService } from '../../../local-storage.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Comment } from '../../../types/Comment';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.scss',
})
export class CommentFormComponent {
  @Output() newItemEvent = new EventEmitter();
  api: ApiService;
  localStorage: LocalStorageService;
  router: Router;
  activatedRoute: ActivatedRoute;

  constructor(
    api: ApiService,
    localStorage: LocalStorageService,
    router: Router,
    activatedRoute: ActivatedRoute
  ) {
    this.api = api;
    this.localStorage = localStorage;
    this.router = router;
    this.activatedRoute = activatedRoute;
  }

  CommentForm = new FormGroup({
    comment: new FormControl('', [Validators.required]),
  });

  displayNewlyAddedComment(comment: any): void {
    this.newItemEvent.emit(comment);
  }

  submitComment() {
    const comment = this.CommentForm.controls.comment.value;
    const recipeId = this.router;

    if (this.CommentForm.invalid || !this.CommentForm.controls.comment) {
      return;
    }

    const commentPayload = {
      comment: comment,
      authorId: this.localStorage.getItem('_id'),
      recipeId: this.activatedRoute.snapshot.params['id'],
      authorName: this.localStorage.getItem('name'),
    };

    this.api.loading = true;

    this.api.postComment(commentPayload).subscribe({
      next: (result) => {
        this.api.loading = false;
        const commentToDisplay = {
          ...commentPayload,
          date: new Date(),
          _id: result._id,
        };
        if (commentToDisplay) {
          this.displayNewlyAddedComment(commentToDisplay as Comment);
        }
      },
      error: (err) => {
        this.api.loading = false;
        if (err.status == 401) {
          this.api.clearLoggedUserData();
        }
        console.log(err);
      },
    });
  }
}
