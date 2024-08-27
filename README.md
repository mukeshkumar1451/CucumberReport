import { Component } from "@angular/core";
import { DataService } from "./dataservice";
import * as JSZip from "jszip";
import { saveAs } from "file-saver";

@Component({
  selector: "app-download-page",
  templateUrl: "./download-page.component.html",
  styleUrls: ["./download-page.component.css"]
})
export class DownloadPageComponent {
  domainName: string = "";
  userStories: boolean = false;
  testCases: boolean = false;
  defects: boolean = false;
  all: boolean = false;

  constructor(private dataService: DataService) {}

  isCheckboxSelected(): boolean {
    return this.userStories || this.testCases || this.defects || this.all;
  }

  async submitForm() {
    if (!this.domainName.trim()) {
      alert("Please enter a domain name.");
      return;
    }

    if (!this.isCheckboxSelected()) {
      alert("Please select at least one checkbox.");
      return;
    }

    const formData = {
      domain: this.domainName,
      "user-stories": this.userStories,
      "test-cases": this.testCases,
      "defect-cases": this.defects
    };

    try {
      // Fetch the ZIP file from the API
      const zipBlob = await this.dataService.getZipData(formData).toPromise();

      // Ensure the filename has a .zip extension
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Format timestamp
      const zipFilename = `data_${timestamp}.zip`;

      // Save the ZIP file
      saveAs(zipBlob, zipFilename);

      alert("Your ZIP file has been downloaded successfully.");
    } catch (error) {
      console.error("Download error:", error);
      alert("There was an error downloading the ZIP file.");
    }
  }

  onCheckboxChange(event: any) {
    const checkbox = event.target as HTMLInputElement;

    switch (checkbox.id) {
      case "userStories":
        this.userStories = checkbox.checked;
        if (checkbox.checked) {
          this.testCases = false;
          this.defects = false;
        }
        break;
      case "testCases":
        this.testCases = checkbox.checked;
        if (checkbox.checked) {
          this.userStories = false;
          this.defects = false;
        }
        break;
      case "defects":
        this.defects = checkbox.checked;
        if (checkbox.checked) {
          this.userStories = false;
          this.testCases = false;
        }
        break;
      case "all":
        this.all = checkbox.checked;
        if (this.all) {
          this.userStories = true;
          this.testCases = true;
          this.defects = true;
        } else {
          this.userStories = false;
          this.testCases = false;
          this.defects = false;
        }
        break;
    }
  }
}
----------------------------------------------
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class DataService {
  private apiUrl = "http://10.120.100.98:9999/download"; // Your API URL

  constructor(private http: HttpClient) {}

  // Method to post data to API and get ZIP file response
  getZipData(requestData: any): Observable<Blob> {
    const headers = new HttpHeaders({
      Accept: "application/zip",
      "Content-Type": "application/json"
    });

    return this.http
      .post(this.apiUrl, requestData, { headers, responseType: "blob" })
      .pipe(
        catchError(error => {
          console.error("Download error:", error);
          return throwError(() => new Error("Download failed"));
        })
      );
  }
}
