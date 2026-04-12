import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  inject,
} from '@angular/core';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { EmptyStateComponent } from '../../../../shared/ui/empty-state/empty-state.component';
import { DealsAnalysisStore } from '../../data-access/deals-analysis.store';
import { DealsScatterChartComponent } from '../../ui/deals-scatter-chart/deals-scatter-chart.component';
import { AnalysisDeal } from '../../models/deals-analysis.model';

@Component({
  selector: 'app-analysis-page',
  standalone: true,
  imports: [CurrencyPipe, PercentPipe, EmptyStateComponent, DealsScatterChartComponent],
  providers: [DealsAnalysisStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analysis-page.component.html',
  styleUrls: ['./analysis-page.component.scss'],
})
export class AnalysisPageComponent implements OnInit {
  protected readonly store = inject(DealsAnalysisStore);

  readonly deals: Signal<AnalysisDeal[]> = this.store.deals;
  readonly isLoading: Signal<boolean> = this.store.isLoading;
  readonly totalDeals: Signal<number> = this.store.totalDeals;
  readonly totalPortfolioValue: Signal<number> = this.store.totalPortfolioValue;
  readonly averageCapRate: Signal<number> = this.store.averageCapRate;

  ngOnInit(): void {
    this.store.loadDeals();
  }
}
