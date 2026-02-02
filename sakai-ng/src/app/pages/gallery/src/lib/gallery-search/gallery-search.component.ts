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

interface ExplorerItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'IMAGE' | 'VIDEO';
    parentId: number | null;
    url?: string;
}

@Component({
    selector: 'app-gallery-search',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        GalleryDetailComponent,
        FileUploadModule,
        DialogModule,
        InputTextModule,
        CheckboxModule,          // Thêm
        FormsModule,
        Toast
    ],
    templateUrl: './gallery-search.component.html',
    styleUrl: 'gallery-search.component.scss'
})
export class GallerySearchComponent implements OnInit {

    // MOCK DATA (giữ nguyên)
    items: ExplorerItem[] = [];

    currentFolderId: number | null = null;
    navigationStack: (number | null)[] = [];
    currentItems: ExplorerItem[] = [];

    selectedItems: ExplorerItem[] = [];

    // preview (giữ nguyên)
    previewVisible = false;
    selectedMedia: ExplorerItem | null = null;
    mediaList: ExplorerItem[] = [];
    currentIndex: number = 0;

    // Tạo thư mục (giữ nguyên)
    showCreateFolderDialog = false;
    newFolderName: string = '';
    folderNameError: string = '';

    // Multi-select & xóa
    multiSelectMode = false;
    showDeleteConfirm = false;
    deleteInProgress = false;

    _querySearch: any = {};

    constructor(
        public mainService: GalleryService,
        public messageService: MessageService,
        private dialogService: DialogService
    ) {

    }

    ngOnInit(): void {
        this.loadFolder(null);
    }

    loadFolder(folderId: number | null) {
        if(folderId == null){
            this.mainService.getList().subscribe({
               next: value => {
                   if(value.body){
                       this.currentItems = value.body.data;
                       this.mediaList = this.currentItems.filter(i => i.type === 'IMAGE' || i.type === 'VIDEO');
                   }
               }
            });
        }
        else {
            this._querySearch.parentId = folderId;
            this.mainService.fetch(this._querySearch).subscribe({
                next: value => {
                    if(value.body){
                        this.currentItems = value.body.data;
                        this.mediaList = this.currentItems.filter(i => i.type === 'IMAGE' || i.type === 'VIDEO');
                    }
                }
            });
        }
    }

    openItem(item: ExplorerItem) {
        if (this.multiSelectMode) {
            // Ở chế độ chọn → click để toggle chọn
            this.toggleSelection(item);
            return;
        }

        if (item.type === 'FOLDER') {
            this.navigationStack.push(this.currentFolderId);
            this.currentFolderId = item.id;
            this.loadFolder(item.id);
        } else {
            this.selectedMedia = item;
            this.currentIndex = this.mediaList.findIndex(m => m.id === item.id);
            this.previewVisible = true;
        }
    }

    goBack() {
        if (this.navigationStack.length === 0) return;
        const prev = this.navigationStack.pop() ?? null;
        this.currentFolderId = prev;
        this.loadFolder(prev);
    }

    onPrev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.selectedMedia = this.mediaList[this.currentIndex];
        }
    }

    onNext() {
        if (this.currentIndex < this.mediaList.length - 1) {
            this.currentIndex++;
            this.selectedMedia = this.mediaList[this.currentIndex];
        }
    }


    uploadFiles(event: FileUploadHandlerEvent): void {
        const files = event.files as File[];
        if (!files?.length) return;

        // Chỉ lấy image / video
        const validFiles = files.filter(file =>
            file.type.startsWith('image/') || file.type.startsWith('video/')
        );

        // Giới hạn tối đa 10 file
        if (validFiles.length > 10) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Quá số lượng',
                detail: 'Chỉ được upload tối đa 10 ảnh hoặc 10 video',
                life: 4000,
                closable: true
            });
            return;
        }

        const formData = new FormData();
        let parentId = this.currentFolderId ?? -1;

        validFiles.forEach(file => {
            formData.append('files', file);
        });

        this.mainService.uploadFile(formData, parentId).subscribe({
            next: value => {
                if (value.body) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Lưu thành công',
                        life: 3000,
                        closable: true
                    });
                    this.loadFolder(this.currentFolderId);
                    files.length = 0;
                }
            },
            error: err => {
                let message = 'Có lỗi xảy ra';
                if (err?.error?.message) {
                    message = err.error.message;
                }

                this.messageService.add({
                    severity: 'error',
                    summary: 'Upload không thành công',
                    detail: message,
                    life: 4000,
                    closable: true
                });
            }
        });
    }



    openCreateFolderDialog() {
        this.newFolderName = '';
        this.folderNameError = '';
        this.showCreateFolderDialog = true;
    }

    createFolder() {
        if (!this.newFolderName.trim()) {
            this.folderNameError = 'Tên thư mục không được để trống';
            return;
        }

        const newId = this.items.length + 1;
        const newFolder: ExplorerItem = {
            id: newId,
            name: this.newFolderName.trim(),
            type: 'FOLDER',
            parentId: this.currentFolderId
        };

        this.mainService.save(newFolder).subscribe({
            next: value => {
                if(value.body){
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Lưu thành công',
                        life: 3000,
                        closable: true
                    })
                    this.loadFolder(this.currentFolderId);
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
                    summary: 'Tạo folder không thành công',
                    detail: message,
                    life: 4000,
                    closable: true
                });
            }
        });

        this.showCreateFolderDialog = false;
        this.newFolderName = '';
        this.folderNameError = '';
    }

    // === PHẦN XÓA MỚI THÊM ===
    toggleMultiSelect() {
        this.multiSelectMode = !this.multiSelectMode;
        if (!this.multiSelectMode) {
            this.selectedItems = [];
        }
    }

    isSelected(item: ExplorerItem): boolean {
        return this.selectedItems.some(i => i.id === item.id);
    }

    toggleSelection(item: ExplorerItem) {
        if (this.isSelected(item)) {
            this.selectedItems = this.selectedItems.filter(i => i.id !== item.id);
        } else {
            this.selectedItems.push(item);
        }
    }

    selectAll() {
        this.selectedItems = [...this.currentItems];
    }

    confirmDelete() {
        if (this.selectedItems.length === 0) return;
        this.showDeleteConfirm = true;
    }

    deleteSelected() {
        this.deleteInProgress = true;

        // Xóa các item đã chọn khỏi mảng gốc
        //this.items = this.items.filter(item => !this.selectedItems.includes(item));

        this.mainService.deleteItem(this.selectedItems).subscribe({
            next: value => {
                if(value.body){
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Xóa thành công',
                        life: 3000,
                        closable: true
                    })
                    this.loadFolder(this.currentFolderId);
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
                    summary: 'Xóa không thành công',
                    detail: message,
                    life: 4000,
                    closable: true
                });
            }
        });

        this.selectedItems = [];
        this.loadFolder(this.currentFolderId);

        this.showDeleteConfirm = false;
        this.deleteInProgress = false;
        this.multiSelectMode = false; // Tự động thoát chế độ chọn sau khi xóa
    }

    cancelDelete() {
        this.showDeleteConfirm = false;
    }
}
