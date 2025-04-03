import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RatingChartsService } from '../../../Shared/Services/rating-charts.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private http: HttpClient, private ratingViewChartServ: RatingChartsService) {}

  viewCount = 0;
  loading = true;

  ngOnInit() {
    this.viewDetails();
    this.ratingDetails();
    this.changeTimePeriod(this.selectedPeriod);
  }
  ratings = [
    { stars: '5 Star', percentage: 0 },
    { stars: '4 Star', percentage: 0 },
    { stars: '3 Star', percentage: 0 },
    { stars: '2 Star', percentage: 0 },
    { stars: '1 Star', percentage: 0 },
  ];
  totalRatings = 0;
  averageRating = 0;
  globalRatingsCount = 0;
  ratingDetails() {
    this.ratingViewChartServ.getRatingChartData().subscribe({
      next: (data: any[] | any) => {
        console.log(data);
        this.processRatings(data.data);
      },
      error: (err:any) => {
        console.error('Error fetching ratings', err);
      },
    });
  }

  processRatings(ratingsData: any[]) {
    const validRatings = ratingsData.filter(
      (r) => r.rating > 0 && r.rating <= 5
    );
    this.globalRatingsCount = validRatings.length;
  
    if (this.globalRatingsCount === 0) return;
  
    // Initialize counts for each star rating (1-5)
    const ratingCounts = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]
  
    validRatings.forEach((rating) => {
      const starIndex = Math.floor(rating.rating);
      if (starIndex >= 1 && starIndex <= 5) {
        ratingCounts[starIndex - 1]++; // Adjust index since arrays are 0-based
      }
    });
  
    // Update ratings array in order (5-star to 1-star)
    this.ratings = this.ratings.map((item, index) => {
      const count = ratingCounts[4 - index]; // Reverse the order (5-star first)
      const percentage = Math.round((count / this.globalRatingsCount) * 100);
      return { ...item, percentage };
    });
  
    const totalStars = validRatings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    this.averageRating = parseFloat(
      (totalStars / this.globalRatingsCount).toFixed(1)
    );
  }
  
  doughnutData = {
    labels: ['Veg', 'Non-Veg'],
    datasets: [
      {
        data: [40, 60],
        backgroundColor: ['#94d396', '#f49690'],
        hoverBackgroundColor: ['#66BB6A', '#EF5350'],
      },
    ],
  };

  doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  viewDetails() {
    this.ratingViewChartServ.getViewsChartData().subscribe({
      next: (data: any) => {
        console.log(data);
        this.viewCount = data.data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching views', err);

        this.loading = false;
      },
    });
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
  
    return (
      '<i class="pi pi-star-fill"></i>'.repeat(fullStars) +
      (halfStar ? '<i class="pi pi-star-half"></i>' : '') +
      '<i class="pi pi-star"></i>'.repeat(emptyStars)
    );
  }

 

  timePeriods = ['daily', 'weekly', 'monthly', 'yearly'];
  selectedPeriod = 'daily';

  chartData = {
    labels: [],
    datasets: [{
      label: 'Customer Visits',
      data: [],
      backgroundColor: '#42A5F5',
      borderColor: '#1E88E5',
      borderWidth: 1
    }]
  };

  chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value: any) => value
        },
        grid: {
          drawTicks: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };



  isLoading = false;

  changeTimePeriod(period: string) {
    this.isLoading = true;
    this.selectedPeriod = period;

    this.ratingViewChartServ.getViewsForDashboard(period).subscribe({
      next: (res: any[] | any) => {
        this.updateChartData(res);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  private updateChartData(apiData: any[]) {
    const labels = apiData.map(item => {
      if (this.selectedPeriod === 'daily') {
        return new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (this.selectedPeriod === 'weekly') {
        return `Week ${item._id.split('-')[1]}`;
      } else if (this.selectedPeriod === 'monthly') {
        return new Date(item._id).toLocaleDateString('en-US', { month: 'long' });
      } else { // yearly
        return item._id;
      }
    });

    const data = apiData.map(item => item.count);

    this.chartData = {
      labels: labels as never,
      datasets: [{
        ...this.chartData.datasets[0],
        data: data as never
      }]
    };
  }
  

}

