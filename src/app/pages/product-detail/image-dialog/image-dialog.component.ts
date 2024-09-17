import { Component, Inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent implements OnInit, OnDestroy {
  currentImageIndex = 0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { images: string[], currentIndex: number }) {
    this.currentImageIndex = data.currentIndex;
  }

  ngOnInit(): void {
    // Listen for keydown events
    document.addEventListener('keydown', this.handleKeyboardEvents.bind(this));
  }

  ngOnDestroy(): void {
    // Remove the event listener on component destroy
    document.removeEventListener('keydown', this.handleKeyboardEvents.bind(this));
  }

  nextImage() {
    if (this.currentImageIndex < this.data.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  previousImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  selectImage(index: number) {
    this.currentImageIndex = index;
  }

  // Method to handle keyboard events
  handleKeyboardEvents(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.nextImage();
    } else if (event.key === 'ArrowLeft') {
      this.previousImage();
    }
  }
}
