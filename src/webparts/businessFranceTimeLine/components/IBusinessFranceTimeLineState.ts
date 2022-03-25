import { ITimelineActivity } from "../../../models";
import { IDropdownOption } from '@fluentui/react/lib/Dropdown';

export interface IBusinessFranceTimeLineState {
    timelineActivities: ITimelineActivity[];
    filteredActivities: ITimelineActivity[];
    options: IDropdownOption[];
    isloading: boolean;
    isCalloutVisible: boolean;
}