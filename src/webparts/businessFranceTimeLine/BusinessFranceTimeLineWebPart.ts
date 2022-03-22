import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IDateTimeFieldValue } from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";
import { PropertyFieldDateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker';
import * as strings from 'BusinessFranceTimeLineWebPartStrings';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import BusinessFranceTimeLine from './components/BusinessFranceTimeLine';
import { IBusinessFranceTimeLineProps } from './components/IBusinessFranceTimeLineProps';
import TimelineService from '../../services/TimelineService';

export interface IBusinessFranceTimeLineWebPartProps {
  description: string;
  listName: string;
  datetime: IDateTimeFieldValue;
  spcontext:WebPartContext;
}

export default class BusinessFranceTimeLineWebPart extends BaseClientSideWebPart<IBusinessFranceTimeLineWebPartProps> {

  private TimelineService: TimelineService = null;

  protected onInit(): Promise<void> {
    this.TimelineService = new TimelineService(this.context);
    return Promise.resolve();
  }


  public render(): void {
    const element: React.ReactElement<IBusinessFranceTimeLineProps> = React.createElement(
      BusinessFranceTimeLine,
      {
        description: this.properties.description,
        datetime: this.properties.datetime,
        listName: this.properties.listName,
        spcontext:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldDateTimePicker('datetime', {
                  label: 'Date de début',
                  initialDate: this.properties.datetime,
                  
                  dateConvention: DateConvention.Date,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'dateTimeFieldId',
                  showLabels: false
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
