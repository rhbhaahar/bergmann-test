import { NgModule } from "@angular/core";
import { DisableButtonDirective } from "./disable-button.directive";
import { MatTooltipModule } from "@angular/material/tooltip";

@NgModule({
    declarations: [DisableButtonDirective],
    imports: [MatTooltipModule],
    exports: [DisableButtonDirective],
}) export default class DirectivesModule{}