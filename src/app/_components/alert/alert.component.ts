import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../../_services';

@Component({ selector: 'alert', templateUrl: 'alert.component.html' })
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.subscription = this.alertService.getAlert().subscribe((message) => {
      switch (message && message.type) {
        case 'success':
          message.cssClass = 'alert alert-success alert-dismissible';
          break;
        case 'error':
          message.cssClass = 'alert alert-danger alert-dismissible';
          break;
      }

      this.message = message;
      // this.autoClose();
    });
  }

  // autoClose() {
  //   setTimeout (() => {
  //     this.message('close');
  //       // alert('a');
  //     }, 3000);
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
