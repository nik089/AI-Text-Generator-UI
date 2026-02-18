import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { AiService, GenerateResponse, GeneratedContent } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'app-generator',
  imports: [FormsModule, CommonModule],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss',
})
export class GeneratorComponent implements OnDestroy {
  prompt: string = '';
  type: string = 'blog';
  result: GeneratedContent | null = null;
  loading: boolean = false;
  errorMessage: string = '';
  private requestSub?: Subscription;

  constructor(
    private aiService: AiService,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  get promptLength(): number {
    return this.prompt?.length || 0;
  }

  generate() {
    if (!this.prompt.trim()) return;

    this.cancelRequest();
    this.loading = true;
    this.result = null;
    this.errorMessage = '';

    this.requestSub = this.aiService
      .generateText({
        prompt: this.prompt,
        type: this.type,
      })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.requestSub = undefined;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res: GenerateResponse) => {
          if (!res?.success || !res?.data) {
            this.result = null;
            this.errorMessage = res?.message || 'No result was returned by the API.';
            this.cdr.detectChanges();
            return;
          }

          this.result = res.data;
          this.cdr.detectChanges();
          this.scrollToResult();
        },
        error: (err: { error?: { message?: string } }) => {
          this.errorMessage =
            err?.error?.message || 'Unable to generate text right now. Please try again.';
          this.cdr.detectChanges();
        },
      });
  }

  onTypeChange() {
    this.cancelRequest();
    this.prompt = '';
    this.result = null;
    this.errorMessage = '';
    this.loading = false;
    this.cdr.detectChanges();
  }

  private scrollToResult() {
    setTimeout(() => {
      this.document.querySelector('.output-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }

  private cancelRequest() {
    this.requestSub?.unsubscribe();
    this.requestSub = undefined;
  }

  ngOnDestroy() {
    this.cancelRequest();
  }
}
