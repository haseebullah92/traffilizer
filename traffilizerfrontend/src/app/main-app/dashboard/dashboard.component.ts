import { Component, OnInit, HostListener } from '@angular/core';
import { HttpApiService } from '../../shared/services/http-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { NotifierService } from 'angular-notifier';
import { environment } from '../../../environments/environment';
import { timer } from 'rxjs/observable/timer';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private _httpService: HttpApiService, private modalService: NgbModal,
    private titleService: Title, private notifierService: NotifierService) { }

  ngOnInit() {
    this.titleService.setTitle('DashBoard - Traffilizer');
    this.currentDuration = localStorage.getItem('duration');
    if (this.currentDuration) {
      this.getDailyStats();
      this.getUrls();
    }
  }

  selectCallDuration(content) {
    setTimeout(() => {
      if (!localStorage.getItem('duration')) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          localStorage.setItem('duration', result);
          this.currentDuration = result;
          this.getDailyStats();
          this.getUrls();
        }, (reason) => {
        });
      }
      else {
      }
    });
  }

  openDurationModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      localStorage.setItem('duration', result);
      this.currentDuration = result;
    }, (reason) => {
    });
  }

  changeDuration() {
    localStorage.setItem('duration', this.currentDuration);
    this.getDailyStats();
    this.getUrls();
    this.recentWebsites = [];
  }

  loading: boolean = false;
  currentDuration: any;

  getDailyStats() {
    this.loading = true;
    this._httpService.masterGet("api/dashboard/dailystats/" + localStorage.getItem('duration')).subscribe(result => {
      this.dailyStats = result;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  newWindow: any;
  dailyStats: any = {
    TrafficGiven: 0,
    TrafficReceived: 0
  };
  source: any;
  subscribe: any;
  currentWebsite: any;
  recentWebsites: any = [];
  reportmessage: string = "";

  earnTrafficModal(content) {
    if (this.urlList && this.urlList.length > 0) {
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
        if (result == "SaveClick") {
          var check = this.newWindow ? this.newWindow.closed : true;
          if (check) {
            this.newWindow = environment.production ? window.open('https://www.traffilizer.com/start', '_blank', 'toolbar=0,width=600,height=600') : window.open('http://localhost:4200/start', '_blank', 'toolbar=0,width=600,height=600');
            var duration = 0;
            if (localStorage.getItem('duration') == '1') {
              duration = 10000;
            }
            else if (localStorage.getItem('duration') == '2') {
              duration = 30000;
            }
            else if (localStorage.getItem('duration') == '3') {
              duration = 60000;
            }
            else if (localStorage.getItem('duration') == '4') {
              duration = 120000;
            }
            this.source = timer(5000, duration);
            this.currentWebsite = undefined;
            this.subscribe = this.source.subscribe(val => this.getUrlForVisit(val));
          }
        }
      }, (reason) => {
      });
    }
    else {
      this.notifierService.notify('error', 'Please add some URL to continue!');
    }

  }

  getUrlForVisit(val) {
    if (!this.newWindow.closed) {

      if (this.currentWebsite) {
        this.recentWebsites.push(this.currentWebsite);
        this.currentWebsite.Count = val + 1;
        this.currentWebsite.Duration = localStorage.getItem('duration');
      }
      else {
        this.currentWebsite = {
          Count: val,
          Duration: localStorage.getItem('duration')
        };
      }

      this.currentWebsite.Mobile = false;

      if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        this.currentWebsite.Mobile = true;
      }

      this._httpService.masterPost("api/dashboard/GetURLForVisit/", this.currentWebsite).subscribe(result => {

        if (this.currentWebsite.URLAddress) {
          this.getDailyStats();
        }

        if (result) {
          this.currentWebsite = result;
          this.newWindow.location.href = result.URLAddress;
        }
        else {
          this.newWindow.close();
          this.currentWebsite = undefined;
          this.source = undefined;
          if (this.subscribe) {
            this.subscribe.unsubscribe();
          }
          this.subscribe = undefined;
        }

      }, error => {
        this.getDailyStats();
        this.newWindow.close();
        this.notifierService.notify('error', JSON.parse(error._body).ExceptionMessage);
        this.currentWebsite = undefined;
        this.source = undefined;
        if (this.subscribe) {
          this.subscribe.unsubscribe();
        }
        this.subscribe = undefined;
      });
    }
    else {
      this.currentWebsite = undefined;
      this.source = undefined;
      if (this.subscribe) {
        this.subscribe.unsubscribe();
      }
      this.subscribe = undefined;
    }
  }

  reportUrl(content, id) {
    this.reportmessage = "";
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/dashboard/reporturl/", {
          Id: id,
          Message: this.reportmessage
        }).subscribe(result => {
          this.loading = false;
          this.notifierService.notify('success', 'URL reported successfully!');
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });
      }
    }, (reason) => {
    });
  }

  ValidURL() {
    var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (!regexp.test(this.urlAddress)) {
      return true;
    } else {
      return false;
    }
  }

  getUrls() {
    this.loading = true;
    this._httpService.masterGet("api/dashboard/GetAllURLs/" + localStorage.getItem('duration')).subscribe(result => {
      this.loading = false;
      this.urlList = result;
    }, error => {
      this.loading = false;
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

  urlAddress: string = "";
  urlList: any = [];

  saveButton() {
    var check = this.urlAddress;
    if (check) {
      return false;
    }
    return true;
  }

  OpenAddUrl(content) {
    this.urlAddress = '';
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      if (result == "SaveClick") {
        this.loading = true;
        this._httpService.masterPost("api/dashboard/addurl", { Url: this.urlAddress, Duration: localStorage.getItem('duration') }).subscribe(result => {
          if (result.success) {
            this.notifierService.notify('success', 'URL added successfully!');
            this.loading = false;
            this.getUrls();
          }
          else {
            this.notifierService.notify('error', result.message);
            this.loading = false;
          }
        }, error => {
          this.notifierService.notify('error', 'Whoops, something went wrong. Probably!');
          this.loading = false;
        });

      }
    }, (reason) => {
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this.newWindow.close();
  }

}
