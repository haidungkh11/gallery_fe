import {Routes} from "@angular/router";
import {GallerySearchComponent} from "@/pages/gallery/src/lib/gallery-search/gallery-search.component";


export default [
    { path: '', data: { breadcrumb: 'gallery' }, component: GallerySearchComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
