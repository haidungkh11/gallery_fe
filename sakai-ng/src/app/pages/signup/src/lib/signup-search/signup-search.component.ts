import {Component, Injector, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox'; // Thêm cho checkbox
import { FormsModule } from '@angular/forms';
import { GalleryDetailComponent } from "@/pages/gallery/src/lib/gallery-detail/gallery-detail.component";
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import {GalleryService} from "@/pages/service/gallery.service";
import {MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {Toast} from "primeng/toast";
import {Password} from "primeng/password";
import {Router} from "@angular/router";
import {AppFloatingConfigurator} from "@/layout/component/app.floatingconfigurator";
import {LoginService} from "@/pages/service/auth.service";




@Component({
    selector: 'signup-search',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FileUploadModule,
        DialogModule,
        InputTextModule,
        CheckboxModule,          // Thêm
        FormsModule,
        Password
    ],
    templateUrl: './signup-search.component.html',
    styleUrl: 'signup-search.component.scss'
})
export class SignupSearchComponent implements OnInit {

    email: string = '';

    password: string = '';

    checked: boolean = false;

    formLogin : any = {};

    constructor(
        public mainService: LoginService,
        public messageService: MessageService,
        private dialogService: DialogService,
        private router: Router
    ) {

    }

    ngOnInit(): void {

    }


    login(){
        this.formLogin.userName = this.email;
        this.formLogin.password = this.password;


        this.mainService.signup(this.formLogin).subscribe({
            next: value => {
                if(value.body){
                    this.messageService.add({
                        severity: 'success',
                        summary:'Đăng kí thành công',
                        detail: 'Mời đăng nhập lại',
                        life: 4000,
                        closable: true
                    });
                    this.router.navigate(['/'])
                }
            },
            error: err => {
                let message = 'Có lỗi xảy ra';

                // Backend trả JSON error
                if (err?.error?.message) {
                    message = err.error;
                }

                this.messageService.add({
                    severity: 'error',
                    summary:'Đăng kí không thành công',
                    detail: message,
                    life: 4000,
                    closable: true
                });
            }
        });
    }

}
