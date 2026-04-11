import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((values) => {
        this.filtersChange.emit({
          name: values.name ?? '',
          priceMin: values.priceMin ?? null,
          priceMax: values.priceMax ?? null,
        });
      });
  }

  onClear(): void {
    this.form.reset({ name: '', priceMin: null, priceMax: null });
  }
}
