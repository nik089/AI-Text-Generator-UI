import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, from, map } from 'rxjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GenerateRequest {
  prompt: string;
  type: string;
}

export interface GeneratedContent {
  title: string;
  image: string;
  type: string;
  wordCount: number;
  content: string;
}

export interface GenerateResponse {
  success: boolean;
  data: GeneratedContent;
  message?: string;
  errorType?: 'missing_key' | 'general';
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'http://localhost:5000/api/generate';

  // TO THE USER: 
  // 1. Get a Gemini API Key from https://aistudio.google.com/
  // 2. Paste your key below:
  private GENAI_API_KEY = 'YOUR_GEMINI_API_KEY';

  constructor(private http: HttpClient) { }

  generateText(data: GenerateRequest): Observable<GenerateResponse> {
    return this.http.post<GenerateResponse>(this.apiUrl, data);
  }

  generateGeminiText(prompt: string): Observable<GenerateResponse> {
    if (!this.GENAI_API_KEY || this.GENAI_API_KEY === 'YOUR_GEMINI_API_KEY') {
      return of({
        success: false,
        data: {} as GeneratedContent,
        message: 'Gemini API Key is missing. Please add your key in ai.service.ts',
        errorType: 'missing_key'
      });
    }

    const genAI = new GoogleGenerativeAI(this.GENAI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promise = model.generateContent(prompt).then(result => {
      const response = result.response;
      const text = response.text();

      const charLimit = 250;
      const summaryText = text.length > charLimit ? text.substring(0, charLimit) + "..." : text;

      return {
        success: true,
        data: {
          title: 'Gemini 1.5 Flash Output',
          image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
          type: 'gemini',
          wordCount: text.split(/\s+/).length,
          content: text
        }
      } as GenerateResponse;
    });

    return from(promise);
  }
}
