import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.group({
    name: [''],
    priceMin: [null as number | null],
    priceMax: [null as number | null],
  });

  constructor() {
    this.form.valueChanges
      .pipe(
        // Debounce raw form changes so each keystroke doesn't trigger
        // a re-filter. startWith is placed AFTER debounceTime so the
        // initial seed value is emitted synchronously on subscribe and
        // bypasses the debounce window.
        debounceTime(300),
        startWith(this.form.getRawValue()),
        map(
          (values): DealFilters => ({
            name: values.name ?? '',
            priceMin: values.priceMin ?? null,
            priceMax: values.priceMax ?? null,
          })
        ),
        distinctUntilChanged(
          (a, b) =>
            a.name === b.name &&
            a.priceMin === b.priceMin &&
            a.priceMax === b.priceMax
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((filters) => this.filtersChange.emit(filters));
  }

  onClear(): void {
    this.form.reset({ name: '', priceMin: null, priceMax: null });
  }
}
