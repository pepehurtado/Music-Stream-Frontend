import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './guards/auth.guard';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [authGuard],
      },
      {
        path: 'artists',
        loadChildren: () => import('./artists/artists.module').then(m => m.ArtistsModule),
        canActivate: [authGuard],
      },
      {
        path: 'songs',
        loadChildren: () => import('./songs/songs.module').then(m => m.SongsModule),
        canActivate: [authGuard],
      },
      {
        path: 'albums',
        loadChildren: () => import('./albums/albums.module').then(m => m.AlbumsModule),
        canActivate: [authGuard],
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
        canActivate: [authGuard],
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule),
        canActivate: [authGuard],
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule),
        canActivate: [authGuard],
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UsersModule)
      },

    ]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**', // Ruta no encontrada
    redirectTo: '/dashboard', // Redirige a /dashboard para rutas no encontradas
  }
];

@NgModule({
  imports: [RouterModule.forRoot(Approutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
