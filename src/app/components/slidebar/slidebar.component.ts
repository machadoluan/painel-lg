import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-slidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './slidebar.component.html',
  styleUrl: './slidebar.component.scss'
})
export class SlidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  user: any;

  constructor(private router: Router, private authService: AuthService) { }


  isActive(route: string): boolean {
    return this.router.url === route;
  }

  ngOnInit(): void {
    this.user = this.authService.getUserFromToken();
    console.log(this.user)
  }

  close() {
    this.closeSidebar.emit();
  }

}
