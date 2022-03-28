import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from "@pnp/sp/presets/all";
import { ITypedHash } from "@pnp/common";
import { ITimelineActivity } from "../models";
import { IDropdownOption } from '@fluentui/react/lib/Dropdown';


export default class TimelineService {

    constructor(private context: WebPartContext) {
        // Setup context to PnPjs
        sp.setup({
            spfxContext: this.context
        });
    }

    public async getTimelineActivities(listId: string, sortOrder: string, dDebute: Date = new Date()): Promise<ITimelineActivity[]> {
        let returnTimelineActivities: ITimelineActivity[] = [];

        let sortOrderAsc: boolean = (sortOrder === "asc");
        let filterString = `DateDeDebut ge datetime'${dDebute.toISOString()}''`;
        try {
            let activities: any[] = await sp.web.lists.getByTitle(listId).items
                .select("Id", "NomDuTempsFort", "DateDeDebut", "DateDeFin", "Pilote/Title", "Description", "Direction", "ActionsDeComMener", "EncodedAbsUrl")
                .orderBy("DateDeDebut", sortOrderAsc)
                .filter(filterString)
                .expand("Pilote")
                .get();
            activities.forEach(activity => {
                let descElement = document.createElement("DIV");
                let actElement = document.createElement("DIV");
                descElement.innerHTML = activity.Description;
                actElement.innerHTML = activity.ActionsDeComMener;
                let outputDesc = descElement.innerText;
                let outputAct = actElement.innerText;
                let timelineActivity = {
                    id: activity.ID,
                    activityTitle: activity.NomDuTempsFort,
                    activityLink: `${this.context.pageContext.site.absoluteUrl}/4500202120/Lists/Events/DispForm.aspx?ID=${activity.ID}`,
                    acivitySDate: activity.DateDeDebut,
                    acivityEDate: activity.DateDeFin,
                    activityPilote: activity.Pilote[0].Title,
                    activityDescription: outputDesc,
                    activityDirection: activity.Direction,
                    activityActions: outputAct
                };

                returnTimelineActivities.push(timelineActivity);

            });
        }
        catch (error) {
            return Promise.reject(error);
        }

        return returnTimelineActivities;
    }

    public async getTimelineOptions(listId: string, sortOrder: string, dDebute: Date = new Date()): Promise<IDropdownOption[]> {
        let returnTimelineActivities: IDropdownOption[] = [{ key: 'All', text: 'All' }];
        let filterString = `DateDeDebut ge datetime'${dDebute.toISOString()}''`;
        try {
            let activities: any[] = await sp.web.lists.getByTitle(listId).items
                .select("Id", "Direction")
                .filter(filterString)
                .get();
           let filter = activities.map(item => item.Direction)
                .filter((value, index, self) => self.indexOf(value) === index);
                filter.forEach(activity => {
                    console.log('activity ',activity)
                let timelineActivity = {
                    key: activity,
                    text: activity
                };

                returnTimelineActivities.push(timelineActivity);

            });
        }
        catch (error) {
            return Promise.reject(error);
        }

        return returnTimelineActivities;
    }

}