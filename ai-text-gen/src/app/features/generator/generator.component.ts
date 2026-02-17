import { Component, Inject } from '@angular/core';
import { AiService, GenerateResponse, GeneratedContent } from '../../services/ai.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-generator',
  imports: [FormsModule, CommonModule],
  templateUrl: './generator.component.html',
  styleUrl: './generator.component.scss'
})
export class GeneratorComponent {

  prompt: string = '';
  type: string = 'blog';
  result: GeneratedContent | null = null;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private aiService: AiService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get promptLength(): number {
    return this.prompt.trim().length;
  }

  generate() {
    if (!this.prompt.trim()) return;

    this.loading = true;
    this.result = null;
    this.errorMessage = '';

    this.aiService.generateText({
      prompt: this.prompt,
      type: this.type
    }).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (res: GenerateResponse) => {
        if (!res?.success || !res?.data) {
          this.result = null;
          this.errorMessage = res?.message || 'No result was returned by the API.';
          return;
        }

        this.result = res.data;
        console.log(res,'data')
        this.scrollToResult();
      },
      error: (err: { error?: { message?: string } }) => {
        this.errorMessage = err?.error?.message || 'Unable to generate text right now. Please try again.';
      }
    });
  }

  private scrollToResult() {
    setTimeout(() => {
      this.document.querySelector('.output-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 50);
  }
}
