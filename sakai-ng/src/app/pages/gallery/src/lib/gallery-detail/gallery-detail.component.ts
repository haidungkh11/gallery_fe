import {
    Component,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    ViewChild,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
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
export class GalleryDetailComponent implements OnInit, OnChanges{

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


    @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;


    translateX = 0;
    translateY = 0;


    startY = 0;

    isDragging = false;

    lastTap = 0;
    doubleTapDelay = 300;

    maxScale = 3;


    lastTranslateX = 0;
    lastTranslateY = 0;




    ngOnInit() {

    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['media'] && !changes['media'].firstChange) {

            // Đợi Angular render xong ảnh mới
            setTimeout(() => {
                this.resetTransform();
            });
        }
    }

    close() {
        this.visibleChange.emit(false);
    }
    goPrev() {
        this.resetTransform();
        this.prev.emit();
    }

    goNext() {
        this.resetTransform();
        this.next.emit();
    }

    onTouchStart(event: TouchEvent) {

        const now = Date.now();

        // DOUBLE TAP
        if (event.touches.length === 1 && now - this.lastTap < this.doubleTapDelay) {
            this.resetZoom();
            this.lastTap = 0;
            return;
        }

        if (event.touches.length === 1) {
            this.lastTap = now;
        }

        // PINCH START
        if (event.touches.length === 2) {
            this.initialDistance = this.getDistance(event.touches);
            this.isDragging = false;
            return;
        }

        // DRAG START
        if (event.touches.length === 1 && this.scale > 1) {
            this.startX = event.touches[0].clientX;
            this.startY = event.touches[0].clientY;
            this.isDragging = true;
        }
    }

    onTouchMove(event: TouchEvent) {

        const img = this.imageElement.nativeElement;

        // PINCH
        if (event.touches.length === 2) {

            const newDistance = this.getDistance(event.touches);
            const scaleChange = newDistance / this.initialDistance;

            this.scale *= scaleChange;
            this.scale = Math.max(1, Math.min(this.scale, this.maxScale));

            this.initialDistance = newDistance;

            this.updateTransform(img);
            return;
        }

        // DRAG
        if (event.touches.length === 1 && this.scale > 1) {

            const touch = event.touches[0];

            if (!this.isDragging) {
                this.startX = touch.clientX;
                this.startY = touch.clientY;
                this.isDragging = true;
                return;
            }

            const dx = touch.clientX - this.startX;
            const dy = touch.clientY - this.startY;

            this.translateX += dx;
            this.translateY += dy;

            this.limitTranslate(img);

            this.startX = touch.clientX;
            this.startY = touch.clientY;

            this.updateTransform(img);
        }
    }
    updateTransform(img: HTMLElement) {
        img.style.transform =
            `translate3d(${this.translateX}px, ${this.translateY}px, 0) scale(${this.scale})`;
    }

    onTouchEnd() {
        this.isDragging = false;
    }

    getDistance(touches: TouchList): number {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    }

    resetZoom() {

        this.scale = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.initialDistance = 0;
        this.isDragging = false;

        this.updateTransform(this.imageElement.nativeElement);
    }


    resetTransform() {

        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;

        this.lastTranslateX = 0;
        this.lastTranslateY = 0;

        this.currentTranslateX = 0;

        if (this.imageElement) {
            const img = this.imageElement.nativeElement;
            img.style.transform = 'translate(0px, 0px) scale(1)';
        }
    }

    limitTranslate(img: HTMLImageElement) {

        const rect = img.getBoundingClientRect();

        const container = img.parentElement!;
        const containerRect = container.getBoundingClientRect();

        const scaledWidth = rect.width;
        const scaledHeight = rect.height;

        const maxX = (scaledWidth - containerRect.width) / 2;
        const maxY = (scaledHeight - containerRect.height) / 2;

        this.translateX = Math.min(maxX, Math.max(-maxX, this.translateX));
        this.translateY = Math.min(maxY, Math.max(-maxY, this.translateY));
    }
}

