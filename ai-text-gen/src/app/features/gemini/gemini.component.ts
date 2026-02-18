import { ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { AiService, GenerateResponse, GeneratedContent } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { finalize, Subscription } from 'rxjs';

@Component({
    selector: 'app-gemini',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './gemini.component.html',
    styleUrl: './gemini.component.scss',
})
export class GeminiComponent implements OnDestroy {
    prompt: string = '';
    result: GeneratedContent | null = null;
    loading: boolean = false;
    errorMessage: string = '';
    isKeyMissing: boolean = false;
    private requestSub?: Subscription;

    constructor(
        private aiService: AiService,
        private cdr: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document,
    ) { }

    generate() {
        if (!this.prompt.trim()) return;

        this.loading = true;
        this.result = null;
        this.errorMessage = '';

        this.requestSub = this.aiService
            .generateGeminiText(this.prompt)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.requestSub = undefined;
                    this.cdr.detectChanges();
                }),
            )
            .subscribe({
                next: (res: GenerateResponse) => {
                    if (!res?.success) {
                        this.result = null;
                        this.errorMessage = res?.message || 'No result was returned.';
                        this.isKeyMissing = res?.errorType === 'missing_key';
                        this.cdr.detectChanges();
                        return;
                    }

                    this.result = res.data;
                    this.cdr.detectChanges();
                    this.scrollToResult();
                },
                error: (err) => {
                    this.errorMessage = 'Unable to generate text. Please try again.';
                    this.isKeyMissing = false;
                    this.cdr.detectChanges();
                },
            });
    }

    private scrollToResult() {
        setTimeout(() => {
            this.document.querySelector('.output-card')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }, 50);
    }

    ngOnDestroy() {
        this.requestSub?.unsubscribe();
    }
}
