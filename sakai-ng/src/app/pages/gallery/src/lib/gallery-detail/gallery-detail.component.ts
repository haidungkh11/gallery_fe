import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
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

    @ViewChild('mediaElement') mediaElement!: ElementRef;

    initialDistance = 0;

    scale = 1;
    startX = 0;
    currentTranslateX = 0;
    isZooming = false;

    @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;


    translateX = 0;
    translateY = 0;


    startY = 0;

    isDragging = false;




    close() {
        this.visibleChange.emit(false);
    }
    goPrev() {
        this.prev.emit();
    }

    goNext() {
        this.next.emit();
    }

    onTouchStart(event: TouchEvent) {

        if (event.touches.length === 2) {
            this.isZooming = true;
            this.initialDistance = this.getDistance(event.touches);
            return;
        }

        if (event.touches.length === 1 && this.scale > 1) {
            this.isDragging = true;

            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;

            return;
        }

        // swipe khi chưa zoom
        if (this.scale === 1) {
            this.startX = event.touches[0].clientX;
        }
    }

    onTouchMove(event: TouchEvent) {

        event.preventDefault(); // 🔥 QUAN TRỌNG CHO IOS

        const img = this.imageElement.nativeElement;

        // ===== PINCH =====
        if (event.touches.length === 2) {

            const newDistance = this.getDistance(event.touches);
            this.scale = Math.max(1, newDistance / this.initialDistance);

            img.style.transform =
                `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;

            return;
        }

        // ===== DRAG =====
        if (event.touches.length === 1 && this.scale > 1) {

            const dx = event.touches[0].clientX - this.startX;
            const dy = event.touches[0].clientY - this.startY;

            this.translateX += dx;
            this.translateY += dy;

            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;

            img.style.transform =
                `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;

            return;
        }

        // ===== SWIPE =====
        if (this.scale === 1) {
            this.currentTranslateX =
                event.touches[0].clientX - this.startX;
        }
    }
    updateTransform(img: HTMLElement) {
        img.style.transform =
            `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
    }

    onTouchEnd() {

        this.isZooming = false;
        this.isDragging = false;

        if (this.scale === 1) {

            if (this.currentTranslateX > 80) {
                this.prev.emit();
            } else if (this.currentTranslateX < -80) {
                this.next.emit();
            }

            this.currentTranslateX = 0;
        }
    }



    getDistance(touches: TouchList): number {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }
}

