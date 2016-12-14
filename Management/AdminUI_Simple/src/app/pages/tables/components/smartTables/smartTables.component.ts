import {Component, ViewEncapsulation} from '@angular/core';

import { SmartTablesService } from './smartTables.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'basic-tables',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./smartTables.scss')],
  template: require('./smartTables.html')
})
export class SmartTables {

  query: string = '';

  settings = {
    actions:{
      edit:false
    },
    //mode:'external',
    add: {
      addButtonContent: '<i class="ion-ios-plus-outline"></i>',
      createButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="ion-edit"></i>',
      saveButtonContent: '<i class="ion-checkmark"></i>',
      cancelButtonContent: '<i class="ion-close"></i>',
      confirmSave : true
    },
    delete: {
      deleteButtonContent: '<i class="ion-trash-a"></i>',
      confirmDelete: true
    },
    columns: {
      deviceId: {
        title: 'Device ID',
        type: 'string',
        //editable: false
      },
      connectionState: {
        title: 'Connected',
        type: 'string',
        editable: false
      },
      status: {
        title: 'Enabled',
        type: 'boolean',
        editable: false
      },
      statusReason: {
        title: 'Reason',
        type: 'string',
        editable: false
      },
      lastActivityTime: {
        title: 'Last Activity Time',
        type: 'Date',
        editable: false
      }
    }
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(protected service: SmartTablesService) {
    this.service.getAllDevices().subscribe((data) => {
      this.source.load(data);
    });
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }


  onSaveConfirm(event):void {
    if (window.confirm('Are you sure you want to save?')) {
      event.newData['name'] += ' + added in code'; 
      event.confirm.resolve(event.newData);
    } else {
      event.confirm.reject();
    }
  }

  onCreateConfirm(event):void {
    if (window.confirm('Are you sure you want to create?')) {
      this.service.createDevice(event.newData.deviceId).subscribe((data) => {
        event.confirm.resolve(data);
      });
    } else {
      event.confirm.reject();
    }
  }
}
