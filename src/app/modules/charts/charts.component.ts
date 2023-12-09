import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Chart } from 'angular-highcharts';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface NewSensorData {
  sensorType: {
    value: string,
    displayValue: string
  } | null,
  chartType: {
    value: 'line' | 'column',
    displayValue: string
  } | null,
  chartColor: {
    value: string,
    displayValue: string
  } | null,
}

interface NewChartData extends NewSensorData {
  chartName?: string | null
}

interface ChartSensor {
  sensorType: string,
  chartType: 'line' | 'column',
  chartColor: string,
}

interface UserChart {
  chart: Chart,
  chartName: string,
  sensors: ChartSensor[],
  newSensorData: NewSensorData
}

const sensorToDailyDTO: { [key: string]: string; } = {
  'Temperature': 'temperature_2m_max',
  'Humidity': 'rain_sum',
  'Light': 'wind_speed_10m_max'
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent implements OnInit {
  private destroyRef = inject(DestroyRef)
  responseArray: any;
  maxDate = new Date();
  editSensor: boolean = false;
  allCharts: UserChart[] = [];

  sensorTypes = [
    { value: 'Temperature', displayValue: 'Temperature' },
    { value: 'Humidity', displayValue: 'Humidity' },
    { value: 'Light', displayValue: 'Light' }
  ];

  chartTypes = [
    { value: 'line', displayValue: 'Line' },
    { value: 'column', displayValue: 'Bar' }
  ];

  chartColors = [
    { value: '#2caffe', displayValue: 'Blue' },
    { value: '#544fc5', displayValue: 'Purple' },
    { value: '#00e272', displayValue: 'Green' },
    { value: '#fe6a35', displayValue: 'Orange' },
    { value: '#6b8abc', displayValue: 'Grey' },
    { value: '#d568fb', displayValue: 'Pink' },
    { value: '#2ee0ca', displayValue: 'Cyan' },
    { value: '#fa4b42', displayValue: 'Red' },
    { value: '#feb56a', displayValue: 'Peach' },
    { value: '#91e8e1', displayValue: 'Aqua' }
  ];

  newChartData: NewChartData = {
    sensorType: null,
    chartType: null,
    chartColor: null,
    chartName: null
  };

  range = new FormGroup({
    start_date: new FormControl<Date | null>(new Date('2023-11-23')),
    end_date: new FormControl<Date | null>(new Date('2023-12-06')),
  });

  constructor(private dataService: DataService,
              private snackBar: MatSnackBar,
              public datepipe: DatePipe) {}

  ngOnInit(): void {
  }

  applyDates(): void {
    const rangeDatePickerValue = this.range.value;
    if (rangeDatePickerValue.start_date && rangeDatePickerValue.end_date && (rangeDatePickerValue.end_date > rangeDatePickerValue.start_date)) {
      this.getData();
    }
  }

  getData(): void {
    for (let i = 0; i < this.allCharts.length; i++) {
      const chart = this.allCharts[i];

      this.requestDataByChart(chart);
    }
  }

  requestDataByChart(userChart: UserChart): void {

    do {
      userChart.chart.removeSeries(0);
    } while (userChart.chart.ref?.series?.length! > 0)

    userChart.sensors.forEach(sensor => {
      const dataType = sensorToDailyDTO[sensor.sensorType];
      const start_date = this.datepipe.transform(this.range.value.start_date, 'YYYY-MM-dd');
      const end_date = this.datepipe.transform(this.range.value.end_date, 'YYYY-MM-dd');

      this.dataService.getWeather({start_date: start_date!, end_date: end_date!}, dataType)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(res => {
          this.responseArray = res.daily[dataType].map((item: any, i: number) => {
            return {
              label: this.datepipe.transform(res.daily.time[i], 'dd MMM'),
              value: item,
            }
          });

            userChart.chart.addSeries({
              type: sensor.chartType,
              data: res.daily[dataType],
              color: sensor.chartColor,
              name: sensor.sensorType}, true, true);
      });
      
    });
  }

  createChart(): UserChart {
    return {
      chart: new Chart({
        chart: {
          type: this.newChartData.chartType?.value
        },
        title: {
          text: this.newChartData.chartName || ''
        },
        credits: {
          enabled: false
        },
        xAxis: {
          labels: {
            enabled: true,
            formatter: (l) => { 
              return this.responseArray?.[l.value]?.label
            },
          } 
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        tooltip: {
          formatter: function() {
            const unit = this.series.name === 'Humidity' ? '%' : this.series.name === 'Temperature' ? '°C' : 'S'
            return `${this.y} ${unit}`
          }
        },
      }),
      sensors: [
        {
          sensorType: this.newChartData.sensorType?.value || '',
          chartType: this.newChartData.chartType?.value || 'line',
          chartColor: this.newChartData.chartColor?.value || '',
        }
      ],
      chartName: this.newChartData.chartName || '',
      newSensorData: {
        sensorType: null,
        chartType: null,
        chartColor: null,
      }
    }
  }

  showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000
    });
  }

  addNewChart(): void {
    if (!this.newChartData.sensorType?.value || !this.newChartData.chartType?.value || !this.newChartData.chartColor?.value || !this.newChartData.chartName) {
      this.showMessage('All fields are required');
      return;
    }

    if (this.allCharts.length > 3) {
      this.showMessage('4 charts maximum');
      return;
    }

    const chart = this.createChart();

    this.allCharts.push(chart);

    this.requestDataByChart(chart);
    this.resetSensorDataValues()
  }

  resetSensorDataValues(): void {
    this.newChartData.sensorType = null;
    this.newChartData.chartType = null;
    this.newChartData.chartColor = null;
    this.newChartData.chartName = null;
  }

  public deleteChart(i: number): void {
    this.allCharts.splice(i, 1);
  }

  public addNewSensor(userChart: UserChart) {
    if (!userChart.newSensorData.sensorType?.value || !userChart.newSensorData.chartType?.value || !userChart.newSensorData.chartColor?.value) {
      this.showMessage('All fields are required');
      return;
    }

    const sensorType = userChart.newSensorData.sensorType?.value;
    const dataType = sensorToDailyDTO[sensorType];
    const start_date = this.datepipe.transform(this.range.value.start_date, 'YYYY-MM-dd');
    const end_date = this.datepipe.transform(this.range.value.end_date, 'YYYY-MM-dd');

    userChart.sensors.push({
      sensorType: userChart.newSensorData.sensorType?.value || '',
      chartType: userChart.newSensorData.chartType?.value || 'line',
      chartColor: userChart.newSensorData.chartColor?.value || '',
    });

    this.dataService.getWeather({start_date: start_date!, end_date: end_date!}, dataType)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        this.responseArray = res.daily[dataType].map((item: any, i: number) => {
          return {
            label: this.datepipe.transform(res.daily.time[i], 'dd MMM'),
            value: item,
          }
        });

        userChart.chart.addSeries({
          type: userChart.newSensorData.chartType?.value!,
          data: res.daily[dataType],
          color: userChart.newSensorData.chartColor?.value,
          name: userChart.newSensorData.sensorType?.value}, true, true)
      });
  }
}
