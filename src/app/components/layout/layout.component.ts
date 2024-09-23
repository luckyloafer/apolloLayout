import {
  Component,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
  OnInit
} from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { DashboardService } from 'src/app/services/dashboard.service';

import * as echarts from 'echarts';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),  
        animate('70ms ease-in', style({ transform: 'translateX(0)' }))  
      ]),
      transition(':leave', [
        animate('70ms ease-out', style({ transform: 'translateX(-100%)' }))  
      ])
    ])
  ]
})
export class LayoutComponent implements AfterViewInit, OnDestroy,OnInit {

  openSidebar: boolean = true;
  myChart: any;
  pieChart: any;
  lineCharts: any[] = [];
  resizeObserver: ResizeObserver | undefined;
  totalRecords: number=0;
  products: any[] =[];
  filterProducts:any[]=[];
  pagedProducts: any[] | undefined;
  rows = 5;
  first=0;
  searchPaginatedProductName:string=''
  topProducts:any[] = [
    {
      name: 'Bamboo Watch',
      image: 'https://apollo.primeng.org/assets/demo/images/product/bamboo-watch.jpg',
      stars: '4 stars',
      price: '$65',
      rating:5,
    },
    {
      name: 'Wood Sunglasses',
      image: 'https://apollo.primeng.org/assets/demo/images/product/black-watch.jpg',
      stars: '5 stars',
      price: '$85',
      rating:4
    },
    {
      name: 'Leather Wallet',
      image: 'https://apollo.primeng.org/assets/demo/images/product/blue-band.jpg',
      stars: '3 stars',
      price: '$45',
      rating:3
    },
    {
      name: 'Wood Sunglasses',
      image: 'https://apollo.primeng.org/assets/demo/images/product/blue-t-shirt.jpg',
      stars: '5 stars',
      price: '$85',
      rating:5
    },
    {
      name: 'Leather Wallet',
      image: 'https://apollo.primeng.org/assets/demo/images/product/bracelet.jpg',
      stars: '3 stars',
      price: '$45',
      rating:4
    },
    {
      name: 'Wood Sunglasses',
      image: 'https://apollo.primeng.org/assets/demo/images/product/brown-purse.jpg',
      stars: '5 stars',
      price: '$85',
      rating:4
    },
  ];

  constructor(private cdr: ChangeDetectorRef,private dashboardService:DashboardService) {
    
  }
  ngOnInit(): void {
    this.loadProducts();
    this.updatePagedProducts();
  }

  loadProducts() {
    this.filterProducts = this.dashboardService.getProductsData();
    this.pagedProducts = this.filterProducts
    this.totalRecords = this.pagedProducts.length;
  }

  updatePagedProducts() {
    const start = this.first;
    const end = this.first + this.rows;
    this.totalRecords = this.filterProducts.length;
    this.pagedProducts = this.filterProducts.slice(start, Math.min(end, this.totalRecords));
    this.cdr.detectChanges(); 
  }
  

  alterSidebar() {
    this.openSidebar = !this.openSidebar;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.initBarChart();
    this.initPieChart();
    this.initMultipleLineCharts(); 
    this.initResizeObserver();
  }

  // barchart

  initBarChart(): void {
    const chartDom = document.getElementById('barchart');

    this.myChart = echarts.init(chartDom);
    const option = {
      grid: {
        top: '8%',  
        left: '3%',    
        right: '3%',   
       
    },

      tooltip: { trigger: 'axis' },
      legend: { data: ['Revenue', 'Profit'], bottom: '0', icon: 'circle' },
      xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yAxis: {},
      series: [
        {
          name: 'Revenue',
          type: 'bar',
          data: [65, 59, 80, 80, 56, 55, 40],
          barGap: 0,
          color: '#6366f1',
          borderWidth: 0,
          barWidth: '10%',
          itemStyle: { borderRadius: [10, 10, 0, 0] },
        },
        {
          name: 'Profit',
          type: 'bar',
          data: [28, 48, 40, 18, 85, 27, 90],
          color: '#9093f5',
          borderWidth: 0,
          barWidth: '10%',
          itemStyle: { borderRadius: [10, 10, 0, 0] },
        },
      ],
    };
    this.myChart.setOption(option);
    this.myChart.resize();
  }

  // piechart

  initPieChart(): void {
    const pieDom = document.getElementById('piechart') as HTMLElement;
    if (pieDom) {
      this.pieChart = echarts.init(pieDom);
      const option = {
        
  
        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: 0,
          data: ['Electronics', 'Fashion', 'Household'],
          icon: 'circle',
          padding: [10, 20], 
        },
        series: [
          {
            name: 'Traffic Source',
            type: 'pie',
            radius: '67%',
            center: ['50%', '43%'],
            label: { show: false },
            data: [
              {
                value: 300,
                name: 'Electronics',
                itemStyle: { color: '#3732d1' },
              },
              { value: 50, name: 'Fashion', itemStyle: { color: '#9093f5' } },
              {
                value: 100,
                name: 'Household',
                itemStyle: { color: '#6366f1' },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      this.pieChart.setOption(option);
      this.pieChart.resize();
    }
  }

  //linechart

  initLineChart(containerId: string, data: number[]): void {
    const lineDom = document.getElementById(containerId) as HTMLElement;
    if (lineDom) {
      const chart = echarts.init(lineDom);
      this.lineCharts.push(chart);

      const option = {
        grid: { left: 0, right: 0, top: 0, bottom: 0 },
        xAxis: {
          type: 'category',
          data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false },
        },
        series: [
          {
            data: data,
            type: 'line',
            smooth: true,
            lineStyle: { width: 1, color: '#ff5722' },
            symbol: 'none',
            emphasis: { itemStyle: { borderColor: 'transparent' } },
          },
        ],
        tooltip: { show: false },
      };

      chart.setOption(option);
      chart.resize();
    }
  }

  initMultipleLineCharts(): void {
    // Example data for multiple line charts
    const data1 = [80, 100, 200, 90, 300, 750, 70, 900];
    const data2 = [120, 150, 200, 250, 300, 400, 500, 600];
    const data3 = [50, 500, 90, 110, 130, 150, 170, 50];

    this.initLineChart('linechart1', data1);
    this.initLineChart('linechart2', data2);
    this.initLineChart('linechart3', data3);
  }

  initResizeObserver(): void {
    const resizeObserver = new ResizeObserver(() => {
      if (this.myChart) this.myChart.resize();
      if (this.pieChart) this.pieChart.resize();
      this.lineCharts.forEach((chart) => chart.resize()); 
    });

    const chartDoms = [
      document.getElementById('barchart') as HTMLElement,
      document.getElementById('piechart') as HTMLElement,
      ...(Array.from(document.querySelectorAll('.linechart')) as HTMLElement[]),
    ];

    chartDoms.forEach((dom) => {
      if (dom) resizeObserver.observe(dom);
    });

    this.resizeObserver = resizeObserver;
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.myChart) {
      this.myChart.dispose();
    }
    if (this.pieChart) {
      this.pieChart.dispose();
    }
    this.lineCharts.forEach((chart) => chart.dispose());
  }

  paginate(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.updatePagedProducts();
  }

  onSearchProductChange(searchTerm:string){
    this.searchPaginatedProductName = searchTerm;
    this.filterPaginatedProducts()
  }
  filterPaginatedProducts() {
    if (this.searchPaginatedProductName) {
      this.filterProducts = this.dashboardService.getFilteredProductsData(this.searchPaginatedProductName);
    } else {
      this.filterProducts = this.dashboardService.getProductsData();
    }
    this.updatePagedProducts(); 
  }
  
}
