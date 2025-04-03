import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { filter, map } from 'rxjs/operators';
import { ConfirmDialog } from 'primeng/confirmdialog';

import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-header',
  imports: [ ButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() isSidebarOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  title = "Dashboard";

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      map(route => route.snapshot.data['title'] || 'Dashboard')
    ).subscribe(title => {
      this.title = title;
    });

    this.updateTitleFromRoute();
  }

  private updateTitleFromRoute() {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    this.title = route.snapshot.data['title'] || 'Dashboard';
  }


  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'b') {
      this.onToggleSidebar()
    }
  }

  logout(event: Event) {

    this.confirmationService.confirm({
      message: `Deseja sair do sistema?`,
      header: 'Sair',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Sair',
        severity: 'danger',
      },

      accept: () => {
        localStorage.removeItem('token')
        this.router.navigate(['/login'])
      },
      reject: () => {
      },
    });
  }
}  