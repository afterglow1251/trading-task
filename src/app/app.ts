import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-root',
  imports: [
    RouterLink,
    RouterOutlet,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzTooltipDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    {
      label: 'Market',
      icon: 'bar-chart',
      children: [
        { label: 'Real-Time Prices', icon: 'line-chart', route: '/realtime' },
        { label: 'Historical Chart', icon: 'area-chart', route: '/historical' },
      ],
    },
    { label: 'Assets', icon: 'database', route: '/assets' },
    { label: 'Settings', icon: 'setting', route: '/settings' },
    { label: 'About', icon: 'info-circle', route: '/about' },
  ];
}
