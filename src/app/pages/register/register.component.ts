import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import Cropper from 'cropperjs';
import { UsuarioService } from '../../shared/services/usuario.service';


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {

  form!: FormGroup;
  submitted = false;
  exibirModal: any;
  @ViewChild('image') imageElement!: ElementRef<HTMLImageElement>;
  cropper!: Cropper;
  imagePreview: string | null = null;
  croppedImage: string | null = null;carregandoImg: any;
  isSaveEnabled: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userSerice: UsuarioService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      image: [null]
    },{ validators: this.passwordMatchValidator });
  }
  ngAfterViewInit(): void {
    this.carregarImagem();
  }


  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmar = form.get('confirmarSenha')?.value;
    return senha === confirmar ? null : { notMatch: true };
  }


  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.authService.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => console.error('Erro ao registrar:', err)
    });
  }

  zoomIn() {
    this.cropper?.zoom(0.1);
  }

  zoomOut() {
    this.cropper?.zoom(-0.1);
  }
  removeImage() {
    if (this.cropper) {
      this.cropper.destroy();
    }
    this.imagePreview = null;
    this.croppedImage = null;
  }
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;

        setTimeout(() => this.initCropper(), 0);
        this.isSaveEnabled = true;
      };
      reader.readAsDataURL(file);
    }
    this.saveCroppedImage();
  }
  
  saveCroppedImage() {
    if (!this.cropper) return;

    this.cropper.getCroppedCanvas().toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], 'avatar.png', { type: 'image/png' });
      
      this.form.patchValue({
        imagem: file
      });
    }, 'image/png');
  }

  private initCropper(): void {
    if(this.imageElement) {
      const image = this.imageElement.nativeElement;
    
      if (this.cropper) {
        this.cropper.destroy();
      }

      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        cropBoxResizable: false,
        cropBoxMovable: false,
        background: false,
        guides: false,
        zoomOnWheel: true,
        ready: () => {
          const canvas = this.cropper.getCroppedCanvas();
          this.croppedImage = canvas.toDataURL();
        }
      });
    }
  }

  
  async carregarImagem(): Promise<void> {
    try {
      this.userSerice.getAvatar(null).subscribe({
        next: (success) => {
          console.log(success)
          this.imagePreview = success.avatarUrl;
          setTimeout(() => this.initCropper(), 0); // Esperar renderizar o <img>
        }
      });
    } catch (error) {
      console.error('Erro ao buscar imagem da API:', error);
    }
  }

}