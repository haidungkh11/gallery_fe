// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
//
// import { TreeNode } from 'primeng/api';
// import { TreeModule } from 'primeng/tree';
//
// import { ImageService } from '@/pages/service/image.service';
//
// @Component({
//     selector: 'app-tree-demo',
//     standalone: true,
//     imports: [
//         CommonModule,
//         FormsModule,
//         TreeModule
//     ],
//     template: `
//         <div class="card">
//             <div class="font-semibold text-xl mb-3">📁 Folder Tree</div>
//
//             <p-tree
//                 [value]="treeValue"
//                 selectionMode="single"
//                 [(selection)]="selectedTreeValue"
//                 (onNodeSelect)="onNodeSelect($event)">
//             </p-tree>
//         </div>
//     `,
//     providers: [ImageService]
// })
// export class TreeDemo implements OnInit {
//
//     treeValue: TreeNode[] = [];
//     selectedTreeValue: TreeNode | null = null;
//
//     private imageService = inject(ImageService);
//
//     ngOnInit(): void {
//         this.loadTree();
//     }
//
//     private loadTree(): void {
//         this.imageService.getFolderTree().then(tree => {
//             this.treeValue = tree;
//         });
//     }
//
//     onNodeSelect(event: any) {
//         const node = event.node;
//
//         if (node.key.startsWith('folder')) {
//             console.log('📁 Folder selected:', node.data);
//         } else {
//             console.log('🖼️ Media selected:', node.data);
//         }
//     }
// }
