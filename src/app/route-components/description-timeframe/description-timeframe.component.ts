import { Component, OnInit, ViewChild } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { FoiRequest } from "src/app/models/FoiRequest";
import { Observable } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { DataService } from "src/app/services/data.service";
// import { map } from 'rxjs/operators';

@Component({
  templateUrl: "./description-timeframe.component.html",
  styleUrls: ["./description-timeframe.component.scss"]
})
export class DescriptionTimeframeComponent implements OnInit {
  @ViewChild(BaseComponent) base: BaseComponent;
  foiForm = this.fb.group({
    topic: [null, [Validators.required]],
    description: [null, [Validators.required]],
    fromDate: [null, [Validators.required]],
    toDate: [null, [Validators.required]],
    bcPublicServiceEmployeeNr: ""
  });

  foiRequest: FoiRequest;
  foiFormData$: Observable<any>;
  showRequestTopic: Boolean = false;
  showPublicServiceEmployeeNumber: Boolean = false;

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.base.getFoiRouteData().subscribe(data => {
      if (data) {
        this.showRequestTopic = data.showRequestTopic || false;
        this.showPublicServiceEmployeeNumber = data.publicServiceEmployeeNumber || false;
      }
    });

    this.foiRequest = this.dataService.getCurrentState();

    const formInit = {
      topic: this.foiRequest.requestData.topic,
      description: this.foiRequest.requestData.description,
      fromDate: this.foiRequest.requestData.fromDate,
      toDate: this.foiRequest.requestData.toDate
    };
    if (!this.showRequestTopic) {
      formInit.topic = this.foiRequest.requestData.requestTopic.text;
    }

    this.foiForm.patchValue(formInit);
  }

  doContinue() {
    // Copy out submitted form data.
    const formData = this.foiForm.value;
    this.foiRequest.requestData.topic = formData.topic;
    this.foiRequest.requestData.description = formData.description;
    this.foiRequest.requestData.fromDate = formData.fromDate;
    this.foiRequest.requestData.toDate = formData.toDate;
    this.foiRequest.requestData.bcPublicServiceEmployeeNr = formData.bcPublicServiceEmployeeNr;

    // Update save data & proceed.
    this.dataService.setCurrentState(this.foiRequest);
    this.base.goFoiForward();
  }

  doGoBack() {
    this.base.goFoiBack();
  }
}
