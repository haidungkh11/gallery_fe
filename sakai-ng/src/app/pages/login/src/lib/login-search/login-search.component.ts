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
import {Router, RouterLink} from "@angular/router";
import {AppFloatingConfigurator} from "@/layout/component/app.floatingconfigurator";



@Component({
    selector: 'login-search',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        FileUploadModule,
        DialogModule,
        InputTextModule,
        CheckboxModule,          // Thêm
        FormsModule,
        Password,
        RouterLink,
        AppFloatingConfigurator
    ],
    templateUrl: './login-search.component.html',
    styleUrl: 'login-search.component.scss'
})
export class LoginSearchComponent implements OnInit {

    email: string = '';

    password: string = '';

    checked: boolean = false;

    constructor(
        public mainService: GalleryService,
        public messageService: MessageService,
        private dialogService: DialogService,
        private router: Router
    ) {

    }

    ngOnInit(): void {

    }


    login(){
        this.router.navigate(['/dashboard/gallery'])
    }
}
