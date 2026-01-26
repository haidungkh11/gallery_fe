import {Routes} from "@angular/router";
import {GallerySearchComponent} from "@/pages/gallery/src/lib/gallery-search/gallery-search.component";
import {LoginSearchComponent} from "@/pages/login/src/lib/login-search/login-search.component";


export default [
    { path: '', data: { breadcrumb: 'login' }, component: LoginSearchComponent },
    // { path: '**', redirectTo: '/notfound' }
] as Routes;
