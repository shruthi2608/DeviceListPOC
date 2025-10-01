import { Component } from '@angular/core';
import { DeviceService } from '../services/device.service';
import { DeviceDetail } from '../models/device.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'thingverse-poc';
   customers: DeviceDetail[] = [];
  constructor(private deviceService: DeviceService) {}

  ngOnInit() {

  }

 
}
