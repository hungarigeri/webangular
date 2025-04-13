import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { Posttartalmak } from '../../models/posttartalmak.model';
import { MatSpinner } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-posztoktartalma',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterModule,
    YouTubePlayerModule,
    HttpClientModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSpinner,
    MatChipsModule,
  ],
  templateUrl: './posztoktartalma.component.html',
  styleUrl: './posztoktartalma.component.css',
})
export class PosztoktartalmaComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  post?: Posttartalmak;
  isLoading = true;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const postId = params['id'];
      this.loadPostDetails(postId);
    });
  }

  loadPostDetails(postId: number): void {
    this.http.get<Posttartalmak>(`assets/posts-detail.json`).subscribe({
      next: (data) => {
        this.post = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading post details:', err);
        this.isLoading = false;
      },
    });
  }
}
