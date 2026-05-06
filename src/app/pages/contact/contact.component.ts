import { ChangeDetectionStrategy,Component, signal,OnInit,ElementRef,AfterViewInit,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WordpressService } from '../../services/wordpress.service';
import { RouterModule,Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAnchor } from "@angular/material/button";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { LottieComponent } from 'ngx-lottie';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-contact',
  imports: [
    RouterModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    ReactiveFormsModule, 
    MatAnchor,
    CommonModule,
    NgxMaskDirective,
    LottieComponent
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactComponent implements OnInit{
  contactPage: any;
  featuredImage: any;
  message1 = 'Your message has been sent';
  message2 = 'successfully';
  message3 = 'Your message has not been sent';
  message4 = 'please try again later';

  respAPI: any;
  closeError = false;
  sentEmail = false;
   
  constructor(
    private wpService: WordpressService,
    private el: ElementRef,
    private router:Router,
    private _snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  
  ngOnInit(): void {
    this.wpService.getPageBySlugContact().subscribe(res => {
      this.contactPage = res[0];
      this.featuredImage = res[0]?._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    });
  }

 

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event: any) => {
      const link = event.target.closest('a');
      if (!link) return;

      const url = link.getAttribute('href');
      if (!url) return;

      const internalDomains = [
        window.location.hostname,
        'admin1.irahetacleaningservicesllc.com'
      ];

      const isInternal =
        internalDomains.some(domain => url.includes(domain)) ||
        url.startsWith('/');

      if (!isInternal) return;

      event.preventDefault();
      event.stopPropagation();

      let path = url;

      if (url.startsWith('http')) {
        path = new URL(url).pathname;
      }

      path = path.replace(/\/$/, '');

      //detectar si el link viene del bloque Latest Posts
      const isLatestPost = link.closest('.wp-block-latest-posts');

      if (isLatestPost) {
        const slug = path.split('/').filter(Boolean)[0];
        path = `/news/${slug}`;
      }
      this.router.navigateByUrl(path);

    }, true);
  }

  contactDataFormGroup = new FormGroup({
    'your-name': new FormControl('', Validators.required),
    'your-email': new FormControl('', [Validators.required, Validators.email]),
    'your-number': new FormControl('', this.yourNumberValidator),
    'your-subject': new FormControl('', Validators.required),
    'your-message': new FormControl('', Validators.required)
  });

yourNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value || value.trim() === '') {
    return null;
  }

  const cleaned = value.replace(/\D/g, '');

  if (!cleaned) {
    return null;
  }

  const regex = /^(\+1\s?)?(\(\d{3}\)|\d{3})[\s-]?\d{3}[\s-]?\d{4}$/;

  return regex.test(value) ? null : { invalidPhone: true };
}

  get yourName(){
    const getName = this.contactDataFormGroup.get('your-name');
    return getName;   
  }

  get yourEmail(){
    const getEmail = this.contactDataFormGroup.get('your-email');
    return getEmail;   
  }

  get yourNumber(){
    const getNumber = this.contactDataFormGroup.get('your-number');
    return getNumber;   
  }

  get yourSubject(){
    const getSubject = this.contactDataFormGroup.get('your-subject');
    return getSubject;   
  }

  get yourMassege(){
    const getMessage = this.contactDataFormGroup.get('your-message');
    return getMessage;   
  }

  onSubmitForm(){
    if(this.contactDataFormGroup.invalid){
      this.contactDataFormGroup.markAllAsTouched();
      return;
    }

   
    console.log(this.contactDataFormGroup.value);
    
    const formData = new FormData();

    if (this.contactDataFormGroup.valid){
      formData.append('_wpcf7', '1310');
      formData.append('_wpcf7_unit_tag', 'wpcf7-1310-o1');

      formData.append('your-name', this.contactDataFormGroup.value['your-name']!);
      formData.append('your-email', this.contactDataFormGroup.value['your-email']!);
      formData.append('your-number', this.contactDataFormGroup.value['your-number']!);
      formData.append('your-subject', this.contactDataFormGroup.value['your-subject']!);
      formData.append('your-message', this.contactDataFormGroup.value['your-message']!);

      this.http.post(
        'https://admin1.irahetacleaningservicesllc.com/wp-json/contact-form-7/v1/contact-forms/1310/feedback',
        formData
      ).subscribe({
        next: (res:any) => {
          this.respAPI = res;
          console.log(this.respAPI);
          this.sentEmail = true;
           this.contactDataFormGroup.reset();
          setTimeout(()=>{    
            this.sentEmail = false;
          }, 10000);
        
          if (this.respAPI.status == "mail_sent"){
            this.contactDataFormGroup.reset();
            this._snackBar.open(
              this.message1,this.message2, {
                duration: 3000,
                panelClass: ['snack-bar-email-sent']
              }
            );
          }
        }, 
        error: (err) => {
          this._snackBar.open(
            this.message3,this.message4, {
              duration: 3000,
              panelClass: ['snack-bar-error-email-sent']
            }
          );
        }
      });
    }
  }



  formatearTelefono(event: any) {
    let valor = event.target.value.replace(/\D/g, '');

    if (valor.length > 10) valor = valor.slice(0, 10);

    let formateado = '';

    if (valor.length > 0) {
      formateado = '(' + valor.substring(0, 3);
    }
    if (valor.length >= 4) {
      formateado += ') ' + valor.substring(3, 6);
    }
    if (valor.length >= 7) {
      formateado += '-' + valor.substring(6, 10);
    }

    this.contactDataFormGroup.get('your-name')?.setValue(formateado, { emitEvent: false });
  }

 lottieOptions = {
    path: 'assets/animations/sent-animation.json', 
    loop: true,
    autoplay: true
  };
}
