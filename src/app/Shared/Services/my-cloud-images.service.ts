import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyCloudImagesService {

  private url = 'https://api.cloudinary.com/v1_1/dqjvm0zwk/image/upload';
  private uploadPreset = 'rammore'; 

  constructor(private http: HttpClient) {}

  uploadImages(image: File) {
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<{ secure_url: string }>(this.url, formData).pipe(
      map((res) => res.secure_url), 
      tap((imageUrl) => console.log('successfully:', imageUrl)),
      catchError((error) => {
        console.error('Error image:', error);
        return throwError(() => new Error('Image upload failed'));
      })
    );
  }
}
