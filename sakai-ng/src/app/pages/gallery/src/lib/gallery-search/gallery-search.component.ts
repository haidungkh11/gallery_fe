import {Component, Injector, OnInit, ViewChild} from '@angular/core';
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
import {MenuItem, MessageService} from "primeng/api";
import {DialogService} from "primeng/dynamicdialog";
import {Toast} from "primeng/toast";
import {Paginator} from "primeng/paginator";
import {ContextMenu, ContextMenuModule} from "primeng/contextmenu";

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
        Toast,
        Paginator,
        ContextMenuModule
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

    page = 0;          // page index (0-based)
    pageSize = 40;     // items mỗi trang
    totalRecords = 0;  // tổng số item

    // ===== CONTEXT MENU =====
    contextMenuItems: MenuItem[] = [];
    rightClickItem: ExplorerItem | null = null;

// ===== RENAME =====
    showRenameDialog = false;
    renameFolderName = '';
    renameTarget: ExplorerItem | null = null;

// ===== LONG PRESS =====
    private longPressTimer: any;
    private readonly LONG_PRESS_DELAY = 600; // ms

    @ViewChild('cm') contextMenu!: ContextMenu;


    constructor(
        public mainService: GalleryService,
        public messageService: MessageService,
        private dialogService: DialogService
    ) {

    }

    ngOnInit(): void {
        this.initContextMenu();
        this.loadFolder(null);
    }

    initContextMenu() {
        this.contextMenuItems = [
            {
                label: 'Đổi tên',
                icon: 'pi pi-pencil',
                command: () => this.openRenameDialog(this.rightClickItem),
                visible: false // sẽ bật động
            }
        ];
    }

    onRightClick(event: MouseEvent, item: ExplorerItem) {
        event.preventDefault();
        event.stopPropagation(); // ✅ thêm dòng này

        if (item.type !== 'FOLDER') return;

        this.rightClickItem = item;
        this.contextMenuItems[0].visible = true;

        this.contextMenu.show(event);
    }



    onTouchStart(item: ExplorerItem) {
        if (item.type !== 'FOLDER') return;

        this.longPressTimer = setTimeout(() => {
            this.rightClickItem = item;
            this.contextMenuItems[0].visible = true;

            // fake event cho context menu
            const fakeEvent = {
                pageX: window.innerWidth / 2,
                pageY: window.innerHeight / 2
            } as MouseEvent;

            this.contextMenu.show(fakeEvent);
        }, this.LONG_PRESS_DELAY);
    }

    onTouchEnd() {
        clearTimeout(this.longPressTimer);
    }

    openRenameDialog(item: ExplorerItem | null) {
        if (!item) return;

        this.renameTarget = item;
        this.renameFolderName = item.name;
        this.showRenameDialog = true;
    }

    confirmRename() {
        debugger
        if (!this.renameTarget) return;

        const newName = this.renameFolderName.trim();
        if (!newName) return;

        const updated = {
            ...this.renameTarget,
            name: newName
        };

        this.mainService.renameFolder(updated).subscribe({
            next: value => {
                if (value.body) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Đổi tên thành công',
                        life: 3000
                    });
                    this.loadFolder(this.currentFolderId);
                }
            },
            error: err => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Đổi tên thất bại',
                    detail: err?.error?.message || 'Có lỗi xảy ra',
                    life: 4000
                });
            }
        });

        this.showRenameDialog = false;
        this.renameTarget = null;
    }



    onPageChange(event: any) {
        this.page = event.page;
        this.pageSize = event.rows;
        this.loadFolder(this.currentFolderId);
    }

    loadFolder(folderId: number | null) {
        if(folderId == null){
            this.mainService.getList().subscribe({
               next: value => {
                   if(value.body){
                       this.currentItems = value.body.data;
                       this.totalRecords = value.body.data.totalElements;
                       this.mediaList = this.currentItems.filter(i => i.type === 'IMAGE' || i.type === 'VIDEO');
                   }
               }
            });
        }
        else {
            this._querySearch.parentId = folderId;
            this._querySearch.page = this.page;
            this._querySearch.size = this.pageSize;
            this.mainService.fetch(this._querySearch).subscribe({
                next: value => {
                    if(value.body){
                        this.currentItems = value.body.data.content;
                        this.totalRecords = value.body.data.totalElements;
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
        this.page = 0;
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
            files.length = 0;
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
