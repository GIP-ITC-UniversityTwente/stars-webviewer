"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
var UserSelectionService = (function () {
    function UserSelectionService() {
        // source study area
        this.studyAreaSource = new Subject_1.Subject();
        // observable study area
        this.studyArea$ = this.studyAreaSource.asObservable();
    }
    /**
     * For changing the studyArea chosen by the user
     * @param studyArea
     */
    UserSelectionService.prototype.updateStudyArea = function (studyArea) {
        this.studyAreaSource.next(studyArea);
    };
    return UserSelectionService;
}());
UserSelectionService = __decorate([
    core_1.Injectable()
], UserSelectionService);
exports.UserSelectionService = UserSelectionService;
