import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CanvasContract from 'src/app/contract-interface/canvas-contract';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
    public image:SafeUrl;
    constructor(private sanitizer: DomSanitizer){

    }
    async ngOnInit(): Promise<void> {
        const canvasContract = new CanvasContract();
        const rgbArray = await canvasContract.getCanvas();
        this.image = this.sanitizer.bypassSecurityTrustUrl(rgbArray.dataURL);
    }
}
