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

    touchStartX = 0;
    initialDistance = 0;
    currentScale = 1;
    isPinching = false;

    scale = 1;
    startX = 0;
    currentTranslateX = 0;
    isZooming = false;



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

        if (this.scale === 1) {
            this.startX = event.touches[0].clientX;
        }
    }

    onTouchMove(event: TouchEvent) {

        // PINCH ZOOM
        if (event.touches.length === 2) {
            const newDistance = this.getDistance(event.touches);
            this.scale = Math.max(1, newDistance / this.initialDistance);
            return;
        }

        // SWIPE chỉ khi không zoom
        if (!this.isZooming && this.scale === 1) {
            this.currentTranslateX =
                event.touches[0].clientX - this.startX;
        }
    }

    onTouchEnd() {

        if (this.isZooming) {
            this.isZooming = false;
            return;
        }

        // chỉ swipe khi scale = 1
        if (this.scale === 1) {
            if (this.currentTranslateX > 80) {
                this.prev.emit();
            } else if (this.currentTranslateX < -80) {
                this.next.emit();
            }
        }

        this.currentTranslateX = 0;
    }



    getDistance(touches: TouchList): number {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }
}

