import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { FormInputComponent } from '../../../../shared/ui/form-input/form-input.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { DealFilters } from '../../models/deal.model';

@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [ReactiveFormsModule, FormInputComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './deal-filters.component.html',
  styleUrls: ['./deal-filters.component.scss'],
})
export class DealFiltersComponent {
  readonly filtersChange = output<DealFilters>();

  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: [null as string | null],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
  });

  constructor() {
    this.form.valueChanges
      .pipe(
        debounceTime(300),
        startWith(this.form.getRawValue()),
        map(
          (values): DealFilters => ({
            name: values.name ?? null,
            minPrice: values.minPrice ?? null,
            maxPrice: values.maxPrice ?? null,
          })
        ),
        distinctUntilChanged(
          (a, b) =>
            a.name === b.name &&
            a.minPrice === b.minPrice &&
            a.maxPrice === b.maxPrice
        ),
        takeUntilDestroyed()
      )
      .subscribe((filters) => this.filtersChange.emit(filters));
  }

  onClear(): void {
    this.form.reset({ name: null, minPrice: null, maxPrice: null });
  }
}
