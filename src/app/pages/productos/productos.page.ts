import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  CurrencyPipe
} from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonBadge
} from '@ionic/angular';
import {
  Product,
  ProductsResponse
} from '../../models/product.model';

import {
  ProductService
} from '../../services/product.service';
import {
  ThemeService
} from '../../services/theme.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonBadge
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  themeService = inject(ThemeService);

  // Listado de productos obtenido exclusivamente de la API REST
  products: Product[] = [];
  total = 0;
  loading = false;
  error = '';

  // Modo de visualización: 'cards' (tarjetas interactivas) o 'table' (tabla formal)
  viewMode: 'cards' | 'table' = 'cards';

  // Paginación reactiva
  currentPage = 1;
  pageSize = 6;

  ngOnInit(): void {
    this.loadProducts();
  }

  ionViewWillEnter(): void {
    if (this.products.length === 0 && !this.loading) {
      this.loadProducts();
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    this.cdr.markForCheck();

    this.productService.getProducts()
      .subscribe({
        next: (response: ProductsResponse) => {
          this.products = response.products;
          this.total = response.total;
          this.loading = false;
          this.currentPage = 1;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.error = 'No se han podido cargar los productos desde la API. Por favor, reintenta.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  // Cálculo del total del stock valorado: unidades * precio - descuento aplicable
  calcularStockValorado(product: Product): number {
    const descuento = product.discountPercentage ? product.discountPercentage / 100 : 0;
    return product.stock * product.price * (1 - descuento);
  }

  // Métricas del Dashboard
  get totalInventoryValue(): number {
    return this.products.reduce((acc, p) => acc + this.calcularStockValorado(p), 0);
  }

  get totalStockUnits(): number {
    return this.products.reduce((acc, p) => acc + (p.stock || 0), 0);
  }

  get averageDiscount(): number {
    if (this.products.length === 0) return 0;
    const sum = this.products.reduce((acc, p) => acc + (p.discountPercentage || 0), 0);
    return Math.round((sum / this.products.length) * 10) / 10;
  }

  // Paginación
  get totalPages(): number {
    return Math.ceil(this.products.length / this.pageSize) || 1;
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.products.slice(start, start + this.pageSize);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.cdr.markForCheck();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cdr.markForCheck();
    }
  }

  setPage(page: number): void {
    this.currentPage = page;
    this.cdr.markForCheck();
  }

  changeViewMode(mode: 'cards' | 'table'): void {
    this.viewMode = mode;
    this.cdr.markForCheck();
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
    this.cdr.markForCheck();
  }
}