import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  AfterViewInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { TaskDataService } from "../../tache/task/task-data.service";
import { UserDataService } from "../../utilisateur/user-data.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
declare var jquery: any;
declare var $: any;
declare var Morris;
declare var echarts;

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  green: {
    primary: '#3b930e',
    secondary: '#3b930e'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  taches;

  allUsers;
  activities;
  id: string = "5bc48479e97a1a1d1cb57e0e";

  view: string = 'month';

  viewDate: Date = new Date();

  modalData: {
    action: string;
    //event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-info-circle"></i>',
      onClick: ({ event }: { event /*CalendarEvent*/ }): void => {
        this.handleEvent('Détails de la tache', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  //events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  element;

  constructor(private modal: NgbModal, private taskDataService: TaskDataService, private userDataService: UserDataService) { }

  ngOnInit() {
    this.userDataService.getUserTaskById(this.id)
      .subscribe(
        data => {
          this.taches = data;
          this.convertTasksToEvents(this.taches);
        }
      );
    this.userDataService.getTabUser()
      .subscribe(
        data => {
          this.allUsers = data;
        }
      );
    this.element = <HTMLInputElement>document.getElementById('graph_bar');
  }

  getUserNameById(id) {
    let nom = "";
    for (let user of this.allUsers) {
      if (user._id == id) {
        nom = user.prenom + " " + user.nom[0] + ".";
      }
    }
    return nom;
  }

  getAllActivities(event) {
    let data = [];
    if (event.info.usersWorkedHours.length != 0) {
      for (let user of event.info.usersWorkedHours) {
        if (user.workedHours.length != 0) {
          for (let workHour of user.workedHours) {
            workHour.idUser = user.idUser;
            workHour.date = new Date(workHour.date);
            // workHour.date = workHour.date.getFullYear() + '-' + ((workHour.date.getMonth() + 1)) + '-' + workHour.date.getDate();
            data.push(workHour);
          }
        }
      }
    }
    return data;
  }

  convertTasksToEvents(tasks) {
    let color;
    let status;
    for (let task of tasks) {
      if (task.status) {
        color = colors.green;
        status = "Open";
      } else {
        color = colors.red;
        status = "Terminated";
      }

      /*this.events.push({
        title: task.name,
        start: startOfDay(task.creationDate),
        end: endOfDay(task.deadline),
        color: color,
        actions: this.actions,
        draggable: false,
        resizable: {
          beforeStart: false,
          afterEnd: false
        },
        info: {
          duration: task.duration,
          status: status,
          projectId: task.projetId,
          usersWorkedHours: task.usersWorkedHours
        }
      });*/
    }
    this.refresh.next();
  }

  dayClicked({ date, events }: { date: Date; events:''
    /*CalendarEvent[]*/
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  getMonthForActivity(month){
    let monthToString;
    switch(month){
      case 1: monthToString = "January"; break;
      case 2: monthToString = "February"; break;
      case 3: monthToString = "March"; break;
      case 4: monthToString = "April"; break;
      case 5: monthToString = "May"; break;
      case 6: monthToString = "June"; break;
      case 7: monthToString = "July"; break;
      case 8: monthToString = "August"; break;
      case 9: monthToString = "September"; break;
      case 10: monthToString = "October"; break;
      case 11: monthToString = "November"; break;
      case 12: monthToString = "December"; break;
    }
    return monthToString;
  }

  handleEvent(action: string, event: ''
              /*CalendarEvent*/
              ): void {
    let totalHoursPerCent = Math.round((this.getTotalWorkedHours(event.info.usersWorkedHours)/(+event.info.duration*8))*100);
    let advance = [{
      value: totalHoursPerCent,
      name: 'Progression'
    }];
    let data = this.getWorkedHoursByUserForChart(event);
    this.activities = this.getAllActivities(event);
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
    $((e) => {
      Morris.Bar({
        element: 'graph_bar',
        data: data,
        xkey: 'user',
        ykeys: ['hours'],
        labels: ['Hours'],
        barRatio: 0.4,
        barColors: ['#26B99A', '#34495E', '#ACADAC', '#3498DB'],
        xLabelAngle: 10,
        hideHover: 'auto',
        resize: true
      });

      var theme = {
        color: [
          '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
          '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
        ],

        title: {
          itemGap: 8,
          textStyle: {
            fontWeight: 'normal',
            color: '#408829'
          }
        },

        dataRange: {
          color: ['#1f610a', '#97b58d']
        },

        toolbox: {
          color: ['#408829', '#408829', '#408829', '#408829']
        },

        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.5)',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#408829',
              type: 'dashed'
            },
            crossStyle: {
              color: '#408829'
            },
            shadowStyle: {
              color: 'rgba(200,200,200,0.3)'
            }
          }
        },

        dataZoom: {
          dataBackgroundColor: '#eee',
          fillerColor: 'rgba(64,136,41,0.2)',
          handleColor: '#408829'
        },
        grid: {
          borderWidth: 0
        },

        categoryAxis: {
          axisLine: {
            lineStyle: {
              color: '#408829'
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#eee']
            }
          }
        },

        valueAxis: {
          axisLine: {
            lineStyle: {
              color: '#408829'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
            }
          },
          splitLine: {
            lineStyle: {
              color: ['#eee']
            }
          }
        },
        timeline: {
          lineStyle: {
            color: '#408829'
          },
          controlStyle: {
            normal: { color: '#408829' },
            emphasis: { color: '#408829' }
          }
        },

        k: {
          itemStyle: {
            normal: {
              color: '#68a54a',
              color0: '#a9cba2',
              lineStyle: {
                width: 1,
                color: '#408829',
                color0: '#86b379'
              }
            }
          }
        },
        map: {
          itemStyle: {
            normal: {
              areaStyle: {
                color: '#ddd'
              },
              label: {
                textStyle: {
                  color: '#c12e34'
                }
              }
            },
            emphasis: {
              areaStyle: {
                color: '#99d2dd'
              },
              label: {
                textStyle: {
                  color: '#c12e34'
                }
              }
            }
          }
        },
        force: {
          itemStyle: {
            normal: {
              linkStyle: {
                strokeColor: '#408829'
              }
            }
          }
        },
        chord: {
          padding: 4,
          itemStyle: {
            normal: {
              lineStyle: {
                width: 1,
                color: 'rgba(128, 128, 128, 0.5)'
              },
              chordStyle: {
                lineStyle: {
                  width: 1,
                  color: 'rgba(128, 128, 128, 0.5)'
                }
              }
            },
            emphasis: {
              lineStyle: {
                width: 1,
                color: 'rgba(128, 128, 128, 0.5)'
              },
              chordStyle: {
                lineStyle: {
                  width: 1,
                  color: 'rgba(128, 128, 128, 0.5)'
                }
              }
            }
          }
        },
        gauge: {
          startAngle: 225,
          endAngle: -45,
          axisLine: {
            show: true,
            lineStyle: {
              color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
              width: 8
            }
          },
          axisTick: {
            splitNumber: 10,
            length: 12,
            lineStyle: {
              color: 'auto'

            }
          },
          axisLabel: {
            textStyle: {
              color: 'auto'
            }
          },

          splitLine: {
            length: 18,
            lineStyle: {
              color: 'auto'
            }
          },
          pointer: {
            length: '90%',
            color: 'auto'
          },
          title: {
            textStyle: {
              color: '#333'
            }
          },
          detail: {
            textStyle: {
              color: 'auto'
            }
          }
        },
        textStyle: {
          fontFamily: 'Arial, Verdana, sans-serif'
        }
      };

      if ($('#echart_gauge').length) {

        var echartGauge = echarts.init(document.getElementById('echart_gauge'), theme);

        echartGauge.setOption({
          tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
          },
          toolbox: {
            show: true,
            feature: {
              restore: {
                show: true,
                title: "Restore"
              },
              saveAsImage: {
                show: true,
                title: "Save Image"
              }
            }
          },
          series: [{
            name: 'Progression',
            type: 'gauge',
            center: ['50%', '50%'],
            startAngle: 140,
            endAngle: -140,
            min: 0,
            max: 100,
            precision: 0,
            splitNumber: 10,
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [0.2, '#ff4500'],
                  [0.4, 'orange'],
                  [0.8, 'skyblue'],
                  [1, 'lightgreen']
                ],
                width: 30
              }
            },
            axisTick: {
              show: true,
              splitNumber: 5,
              length: 8,
              lineStyle: {
                color: '#eee',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              show: true,
              formatter: function(v) {
                switch (v + '') {
                  case '10':
                    return 'debut';
                  case '30':
                    return '';
                  case '60':
                    return '';
                  case '90':
                    return 'goal';
                  default:
                    return '';
                }
              },
              textStyle: {
                color: '#333'
              }
            },
            splitLine: {
              show: true,
              length: 30,
              lineStyle: {
                color: '#eee',
                width: 2,
                type: 'solid'
              }
            },
            pointer: {
              length: '80%',
              width: 8,
              color: 'auto'
            },
            title: {
              show: true,
              offsetCenter: ['-65%', -10],
              textStyle: {
                color: '#333',
                fontSize: 15
              }
            },
            detail: {
              show: true,
              backgroundColor: 'rgba(0,0,0,0)',
              borderWidth: 0,
              borderColor: '#ccc',
              width: 100,
              height: 40,
              offsetCenter: ['-60%', 10],
              formatter: '{value}%',
              textStyle: {
                color: 'auto',
                fontSize: 30
              }
            },
            data: advance
          }]
        });
      }
    });
  }

  getTotalWorkedHours(workedHoursTab) {
    let total = 0;
    if (workedHoursTab.length != 0) {
      for (let user of workedHoursTab) {
        if (user.workedHours.length != 0) {
          for (let workHour of user.workedHours) {
            total += workHour.workedHoursByDay;
          }
        }
      }
    }
    return total;
  }

  getWorkedHoursByUserForChart(event) {
    let data = [];
    let total = 0;
    if (event.info.usersWorkedHours.length != 0) {
      for (let user of event.info.usersWorkedHours) {
        if (user.workedHours.length != 0) {
          for (let workHour of user.workedHours) {
            total += workHour.workedHoursByDay;
          }
          let obj = { user: this.getUserNameById(user.idUser), hours: total };
          data.push(obj);
          total = 0;
        } else {
          let obj = { user: this.getUserNameById(user.idUser), hours: total };
          data.push(obj);
          total = 0;
        }
      }
    }
    return data;
  }



}
