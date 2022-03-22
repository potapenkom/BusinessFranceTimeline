import {WebPartContext} from '@microsoft/sp-webpart-base';
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";

export interface IBusinessFranceTimeLineProps {
  description: string;
  listName: string;
  datetime: IDateTimeFieldValue;
  spcontext: WebPartContext;
}
