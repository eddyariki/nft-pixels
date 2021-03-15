import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import CanvasContract from 'src/app/contract-interface/canvas-contract';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {

    async ngOnInit(): Promise<void> {
        const canvasContract = new CanvasContract();
        const rgbArray = await canvasContract.getCanvas();
        console.log(rgbArray);
    }
}
