import { Component, OnInit, ViewChild } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ChartComponent, ApexDataLabels, ApexYAxis, ApexLegend, ApexXAxis, ApexTooltip, ApexTheme, ApexGrid } from 'ng-apexcharts';
import { HistoryService } from '../../service/history.service';

export type salesChartOptions = {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any;
  theme: ApexTheme | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
};

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html'
})
export class SalesSummaryComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent = Object.create(null);
  public salesChartOptions: Partial<salesChartOptions>;

  constructor(private historyService: HistoryService) {
    this.salesChartOptions = {
      series: [],
      chart: {
        fontFamily: 'Nunito Sans,sans-serif',
        height: 250,
        type: 'area',
        toolbar: {
          show: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: '1',
      },
      grid: {
        strokeDashArray: 3,
      },
      xaxis: {
        categories: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
      },
      tooltip: {
        theme: 'dark'
      }
    };
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    //Poner el ultimo dia del año actual, 31-12-AñoActual
    const today = new Date().getFullYear() + '-12-31';
    this.historyService.getAllEntitiesByDate(today).subscribe(data => {
      const seriesData = this.processAllData(data);
      this.salesChartOptions.series = seriesData;
    });
  }

  processAllData(data: any[]): any[] {
    const types = ['Artist', 'Song', 'Album', 'Genre'];
    return data.map((typeData, index) => {
      const counts = this.processData(typeData);
      return {
        name: types[index],
        data: counts
      };
    });
  }

  processData(data: any[]): number[] {
    const counts = Array(12).fill(0);
    data.forEach(item => {
      const date = new Date(item.timestamp);
      const month = date.getMonth(); // Get month index (0-11)
      counts[month]++;
    });
    return counts;
  }
}
