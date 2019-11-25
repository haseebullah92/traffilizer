import { Component, OnInit } from '@angular/core';
import { HttpApiService } from '../../shared/services/http-api.service';
import { Title } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  constructor(private _httpService: HttpApiService, private modalService: NgbModal,
    private titleService: Title, private notifierService: NotifierService) { }

  ngOnInit() {
    this.titleService.setTitle('Admin - Traffilizer');
    this.getUsers();
    this.getWebsites();
    this.getReports();
  }

  loading: boolean = false;
  userList: any = [];
  urlList: any = [];
  reportList: any = [];
  adminSelect: number = 1;

  getReports() {
    this.loading = true;
    this._httpService.masterGet("api/admin/getallreports").subscribe(result => {
      this.loading = false;
      this.reportList = result;
    }, error => {
      this.loading = false;
    });
  }

  getWebsites() {
    this.loading = true;
    this._httpService.masterGet("api/admin/getallwebsites").subscribe(result => {
      this.loading = false;
      this.urlList = result;
    }, error => {
      this.loading = false;
    });
  }

  getUsers() {
    this.loading = true;
    this._httpService.masterGet("api/admin/getalluser").subscribe(result => {
      this.loading = false;
      this.userList = result;
    }, error => {
      this.loading = false;
    });
  }

  inActiveUser(id) {
    this.loading = true;
    this._httpService.masterPost("api/admin/deactivateuser/", { "Id": id }).subscribe(result => {
      this.notifierService.notify('success', 'User deactivate successfully!');
      this.loading = false;
      for (const index in this.userList) {
        if (this.userList[index].Id == id) {
          this.userList[index].Status = false;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  activeUser(id) {
    this.loading = true;
    this._httpService.masterPost("api/admin/activateuser/", { "Id": id }).subscribe(result => {
      this.notifierService.notify('success', 'URL activate successfully!');
      this.loading = false;
      for (const index in this.userList) {
        if (this.userList[index].Id == id) {
          this.userList[index].Status = true;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  deleteUser(content, id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/admin/deleteuser/", { "Id": id }).subscribe(result => {
          this.notifierService.notify('success', 'User deleted successfully!');
          this.loading = false;
          for (const index in this.userList) {
            if (this.userList[index].Id == id) {
              this.userList.splice(index, 1);
            }
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });
  }


  disableUrl(id) {
    this.loading = true;
    this._httpService.masterPost("api/dashboard/disableurl/", id).subscribe(result => {
      this.notifierService.notify('success', 'URL disabled successfully!');
      this.loading = false;
      for (const index in this.urlList) {
        if (this.urlList[index].Id == id) {
          this.urlList[index].Status = false;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  enableUrl(id) {
    this.loading = true;
    this._httpService.masterPost("api/dashboard/enableurl/", id).subscribe(result => {
      this.notifierService.notify('success', 'URL enabled successfully!');
      this.loading = false;
      for (const index in this.urlList) {
        if (this.urlList[index].Id == id) {
          this.urlList[index].Status = true;
        }
      }
    }, error => {
      this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
      this.loading = false;
    });
  }

  deleteUrl(content, id) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/dashboard/deleteurl/", id).subscribe(result => {
          this.notifierService.notify('success', 'URL deleted successfully!');
          this.loading = false;
          for (const index in this.urlList) {
            if (this.urlList[index].Id == id) {
              this.urlList.splice(index, 1);
            }
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });

  }

  deleteReportUrl(content, id){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/admin/deletereporturl/", id).subscribe(result => {
          this.notifierService.notify('success', 'URL deleted successfully!');
          this.loading = false;
          for (const index in this.reportList) {
            if (this.reportList[index].Id == id) {
              this.reportList.splice(index, 1);
            }
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });
  }

  resolveReport(content, id){
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/admin/resolvereport/", id).subscribe(result => {
          this.notifierService.notify('success', 'Report resolved successfully!');
          this.loading = false;
          for (const index in this.reportList) {
            if (this.reportList[index].Id == id) {
              this.reportList.splice(index, 1);
            }
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });
  }


}
