import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import CanvasContract from 'src/app/contract-interface/canvas-contract';

// import { State } from '../../model/store/reducers';
// import { Actions, Store } from 'src/app/lib/ngrx';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
    public image:SafeUrl;
//     constructor(private sanitizer: DomSanitizer){


//     }
//     async ngOnInit(): Promise<void> {
//         const canvasContract = new CanvasContract();
//         const rgbArray = await canvasContract.getCanvas();
//         this.image = this.sanitizer.bypassSecurityTrustUrl(rgbArray.dataURL);
//     }

    ngOnInit(): void {}

    constructor(private actions$: Actions, private store$: Store<any>) {}

}
