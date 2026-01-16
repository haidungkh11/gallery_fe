import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';

@Injectable()
export class ImageService {

    getFolderTree(): Promise<TreeNode[]> {
        const data = this.getMockData();

        const tree = this.buildTree(
            data.folders,
            data.media,
            null
        );

        return Promise.resolve(tree);
    }

    // ===============================
    // BUILD TREE (QUAN TRỌNG NHẤT)
    // ===============================
    private buildTree(
        folders: any[],
        media: any[],
        parentId: number | null
    ): TreeNode[] {

        return folders
            .filter(folder => folder.parentId === parentId)
            .map(folder => {

                // Sub folders
                const childFolders = this.buildTree(
                    folders,
                    media,
                    folder.id
                );

                // Media thuộc folder này
                const childMedia: TreeNode[] = media
                    .filter(m => m.folderId === folder.id)
                    .map(m => ({
                        key: `media-${m.id}`,
                        label: m.fileName,
                        icon: m.fileType === 'VIDEO'
                            ? 'pi pi-video'
                            : 'pi pi-image',
                        leaf: true,
                        data: m
                    }));

                return {
                    key: `folder-${folder.id}`,
                    label: folder.name,
                    icon: 'pi pi-folder',
                    expanded: true,
                    data: folder,
                    children: [
                        ...childFolders,
                        ...childMedia
                    ]
                };
            });
    }

    // ===============================
    // MOCK DATA (THAY = API SAU)
    // ===============================
    private getMockData() {
        return {
            folders: [
                { id: 1, name: 'Gia đình', parentId: null },
                { id: 2, name: '2023', parentId: 1 },
                { id: 3, name: '2024', parentId: 1 },
                { id: 4, name: 'Sinh nhật', parentId: 2 }
            ],
            media: [
                {
                    id: 101,
                    fileName: 'sinh-nhat.jpg',
                    fileType: 'IMAGE',
                    mimeType: 'image/jpeg',
                    folderId: 4,
                    url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e'
                },
                {
                    id: 102,
                    fileName: 'gia-dinh.png',
                    fileType: 'IMAGE',
                    mimeType: 'image/png',
                    folderId: 2,
                    url: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d'
                },
                {
                    id: 201,
                    fileName: 'le-tot-nghiep.mp4',
                    fileType: 'VIDEO',
                    mimeType: 'video/mp4',
                    folderId: 3,
                    url: 'https://www.w3schools.com/html/mov_bbb.mp4'
                }
            ]
        };
    }

}
