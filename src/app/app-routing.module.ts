import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('src/app/modules/charts/charts.module') },
  { path: 'mat-button', loadComponent: () =>  import('src/app/components/directive-demo/directive-demo.component').then(c => c.DirectiveDemoComponent)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
