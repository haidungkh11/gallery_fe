import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import {ButtonDirective} from "primeng/button";

@Component({
    selector: 'app-gallery-detail',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonDirective],
    templateUrl: './gallery-detail.component.html',
    styleUrl: 'gallery-detail.component.scss'
})
export class GalleryDetailComponent  {

    @Input() media: any;
    @Input() mediaList: any[] = [];    // List media từ parent
    @Input() currentIndex: number = 0; // Index hiện tại

    @Input() visible = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() prev = new EventEmitter<void>();  // Event prev
    @Output() next = new EventEmitter<void>();  // Event next

    close() {
        this.visibleChange.emit(false);
    }
    goPrev() {
        this.prev.emit();
    }

    goNext() {
        this.next.emit();
    }
}

