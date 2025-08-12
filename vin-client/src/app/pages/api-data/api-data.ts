import { Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, NgIf, AsyncPipe, CurrencyPipe } from '@angular/common';
import { ApiService, Product } from '../../core/api.service';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe, CurrencyPipe],
  template: `
    <button (click)="reload()">Reload</button>

    <p *ngIf="loading()">Loading…</p>
    <p class="err" *ngIf="error()">{{ error() }}</p>

    <ng-container *ngIf="products$ | async as products">
      <div *ngFor="let p of products.slice(0, 10)" class="card">
        <h3>#{{ p.id }} — {{ p.title }}</h3>
        <p>{{ p.description }}</p>
        <p><strong>Price:</strong> {{ p.price | currency:'USD' }}</p>
      </div>
      <p *ngIf="!products.length">No data available.</p>
    </ng-container>
  `,
  styles: [`
    .card { padding:1rem; border:1px solid #eee; border-radius:12px; margin:.5rem 0; }
    .err { color:#b00020; }
    button { margin:.5rem 0; }
  `]
})
export class ApiDataComponent implements OnInit {
  private api = inject(ApiService);

  products$!: Observable<Product[]>;
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.error.set(null);
    this.products$ = this.api.getProducts();
    this.products$.subscribe({
      next: () => this.loading.set(false),
      error: (e) => { this.loading.set(false); this.error.set(e.message ?? 'Error'); }
    });
  }

  reload() { this.load(); }
}
