import {Routes} from "@angular/router";
import {SignupSearchComponent} from "@/pages/signup/src/lib/signup-search/signup-search.component";


export default [
    { path: '', data: { breadcrumb: 'signup' }, component: SignupSearchComponent },
    // { path: '**', redirectTo: '/notfound' }
] as Routes;
