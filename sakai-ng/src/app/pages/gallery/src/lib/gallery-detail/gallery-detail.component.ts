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

        // 1 ngón -> swipe
        if (event.touches.length === 1) {
            this.touchStartX = event.touches[0].screenX;
        }

        // 2 ngón -> zoom
        if (event.touches.length === 2) {
            this.isPinching = true;
            this.initialDistance = this.getDistance(event);
        }
    }

    onTouchMove(event: TouchEvent) {

        if (event.touches.length === 2) {
            event.preventDefault();

            const newDistance = this.getDistance(event);
            const scaleChange = newDistance / this.initialDistance;

            this.currentScale *= scaleChange;

            // Giới hạn zoom
            this.currentScale = Math.min(Math.max(this.currentScale, 1), 4);

            this.mediaElement.nativeElement.style.transform =
                `scale(${this.currentScale})`;

            this.initialDistance = newDistance;
        }
    }

    onTouchEnd(event: TouchEvent) {

        if (this.isPinching) {
            this.isPinching = false;
            return; // không xử lý swipe nếu đang zoom
        }

        const touchEndX = event.changedTouches[0].screenX;
        const diff = this.touchStartX - touchEndX;
        const threshold = 50;

        if (Math.abs(diff) < threshold) return;

        if (diff > 0 && this.currentIndex < this.mediaList.length - 1) {
            this.goNext();
        } else if (diff < 0 && this.currentIndex > 0) {
            this.goPrev();
        }
    }

    getDistance(event: TouchEvent): number {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

