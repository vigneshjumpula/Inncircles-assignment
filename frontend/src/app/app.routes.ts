import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { RightComponent } from './components/right/right.component';
import { AddHelperComponent } from './components/add-helper/add-helper.component';
import { DocumentComponent } from './components/document/document.component';
import { FormComponent } from './components/form/form.component';
import { ReviewComponent } from './components/review/review.component';  

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    },
    {
        path: 'main',
        component: MainComponent,
        children: [
            {path: 'helpers/:id', component: RightComponent}
        ]
    },
    {
        path: 'add-helper',
        component: AddHelperComponent,
        children: [
            { path: '', redirectTo: 'helper/form', pathMatch: 'full' },
            { path: 'helper/form',     component: FormComponent },
            { path: 'helper/document', component: DocumentComponent },
            { path: 'helper/review',   component: ReviewComponent }
        ]
    },
    {
        path: 'edit-helper',
        component: AddHelperComponent,
        children: [
            { path: '', redirectTo: 'form', pathMatch: 'full' },
            { path: 'form',     component: FormComponent },
            { path: 'document', component: DocumentComponent }
        ]
    }
];
