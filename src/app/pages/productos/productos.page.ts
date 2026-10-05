import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import {
  CurrencyPipe
} from '@angular/common';
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
  IonCardContent,
  IonButton
} from '@ionic/angular';
import {
  Product,
  ProductsResponse
} from '../../models/product.model';

import {
  ProductService
} from '../../services/product.service';

export interface JuicyBag {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
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
    IonCardContent,
    IonButton
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);

  // Cuadraditos de bolsos Juicy Couture con imágenes de assets/images
  juicyBags: JuicyBag[] = [
    {
      id: 1,
      nombre: 'Bolso Juicy Couture Pink Velvet',
      descripcion: 'Edición rosa terciopelo con charm dorado',
      precio: 89.99,
      imagen: 'assets/images/bolso1.jpg'
    },
    {
      id: 2,
      nombre: 'Bolso Juicy Couture Classic Black',
      descripcion: 'Bolso bandolera negro con logo bordado',
      precio: 95.00,
      imagen: 'assets/images/bolso2.jpg'
    },
    {
      id: 3,
      nombre: 'Bolso Juicy Couture Daydreamer',
      descripcion: 'Diseño icónico Y2K con lazos laterales',
      precio: 119.99,
      imagen: 'assets/images/bolso3.jpg'
    },
    {
      id: 4,
      nombre: 'Bolso Juicy Couture Glam Tote',
      descripcion: 'Tote espacioso con detalles en pedrería',
      precio: 129.50,
      imagen: 'assets/images/bolso4.jpg'
    }
  ];

  products: Product[] = [];
  total = 0;
  loading = false;
  error = '';

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

    console.log('Solicitando productos a la API...');

    this.productService.getProducts()
      .subscribe({
        next: (response: ProductsResponse) => {
          console.log('Productos recibidos:', response.products.length);
          this.products = response.products;
          this.total = response.total;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.error = 'No se han podido cargar los productos. Por favor, reintenta.';
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }
}