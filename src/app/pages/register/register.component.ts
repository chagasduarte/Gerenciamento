import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'cropperjs/dist/cropper.css';
import { UsuarioService } from '../../shared/services/usuario.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { UserRequest, Usuario } from '../../shared/models/user.model';

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
  cropper: Cropper | null = null;
  imagePreview: string | null = null;
  croppedImage: string | null = null;carregandoImg: any;
  isSaveEnabled: any;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userSerice: UsuarioService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      image: [null]
    },{ validators: this.passwordMatchValidator });
  }
  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.carregarImagem();
    }
  }


  passwordMatchValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmar = form.get('confirmarSenha')?.value;
    return senha === confirmar ? null : { notMatch: true };
  }


  onSubmit() {
    this.saveCroppedImage()
    this.submitted = true;
    if (this.form.invalid) return;
    const request: UserRequest = {
      nome: this.form.value.nome,
      senha: this.form.value.senha,
      confirmarSenha: this.form.value.confirmarSenha,
      avatar: this.form.value.image,
    }
  
    this.authService.register(request).subscribe({
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
        image: file
      });
      console.log(this.form.value)
    }, 'image/png');
  }

  private async initCropper(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const CropperModule: any = await import('cropperjs');

    // VERDADEIRA classe construtora
    const CropperClass = CropperModule.Cropper || CropperModule.default || CropperModule;


    const image = this.imageElement.nativeElement;

    if (this.cropper) {
      this.cropper.destroy();
    }

    this.cropper = new CropperClass(image, {
      aspectRatio: 1,
      viewMode: 1,
      dragMode: 'move',
      cropBoxResizable: false,
      cropBoxMovable: false,
      background: false,
      guides: false,
      zoomOnWheel: true,
      ready: () => {
        const canvas = this.cropper!.getCroppedCanvas();
        this.croppedImage = canvas.toDataURL();
      }
    });
  }


  
  async carregarImagem(): Promise<void> {
    try {
      this.userSerice.getAvatar(null).subscribe({
        next: (success) => {
          this.imagePreview = success.avatarUrl;
          setTimeout(() => this.initCropper(), 0); // Esperar renderizar o <img>
        }
      });
    } catch (error) {
      console.error('Erro ao buscar imagem da API:', error);
    }
  }

}