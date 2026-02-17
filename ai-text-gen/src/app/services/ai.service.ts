import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class AiService {

  private apiUrl = 'http://localhost:5000/api/generate';

  constructor(private http: HttpClient) {}

  generateText(data: GenerateRequest): Observable<GenerateResponse> {
    return this.http.post<GenerateResponse>(this.apiUrl, data);
  }
}
