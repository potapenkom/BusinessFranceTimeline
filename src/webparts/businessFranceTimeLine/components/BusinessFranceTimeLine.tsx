import * as React from 'react';
import { useEffect, useState, useMemo } from "react";
import styles from './BusinessFranceTimeLine.module.scss';
import { IBusinessFranceTimeLineProps } from './IBusinessFranceTimeLineProps';
import { IBusinessFranceTimeLineState } from './IBusinessFranceTimeLineState';
import { escape } from '@microsoft/sp-lodash-subset';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './mystyle.css';
import TimelineService from '../../../services/TimelineService';
import { ITimelineActivity } from '../../../models/ITimelineActivity';
import { SPPermission } from '@microsoft/sp-page-context';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';
import { Dropdown, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import * as moment from 'moment-timezone';
import * as CSS from 'csstype';
var divStyle: CSS.Properties<string | number> = {
  background: 'rgb(227, 227, 227)'
};

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 300 },
};


const stackTokens: IStackTokens = { childrenGap: 20 };

export default class BusinessFranceTimeLine extends React.Component<IBusinessFranceTimeLineProps, IBusinessFranceTimeLineState> {
  private TimelineService: TimelineService = null;
  private canEdit: any = null;

  constructor(props: IBusinessFranceTimeLineProps) {
    super(props);

    this.state = {
      timelineActivities: [],
      options: [],
      filteredActivities: [],
      isloading: false
    };

    this.TimelineService = new TimelineService(this.props.spcontext);
    this.onDismissPanel = this.onDismissPanel.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    let permission = new SPPermission(this.props.spcontext.pageContext.web.permissions.value);
    this.canEdit = permission.hasPermission(SPPermission.manageWeb);

  }

  private async onDismissPanel(refresh: boolean) {
    if (refresh === true) {
      this.TimelineService.getTimelineActivities('Events', 'asc').then((activities: ITimelineActivity[]) => {
        this.setState({ timelineActivities: activities });
        this.setState({ filteredActivities: activities });
      });
    }
  }

  private getFilteredList(key: string) {
    if (!key || key === "All") {
      this.setState({ filteredActivities: this.state.timelineActivities });
    } else {
      let filtered: ITimelineActivity[] = this.state.timelineActivities.filter(activity => {

        return key === activity.activityDirection;
      });
      this.setState({ filteredActivities: filtered });
    }
  }

  private onChangeHandler(event: React.FormEvent<HTMLDivElement>, item: IDropdownOption) {
    this.getFilteredList(item.key as string);
  }


  public render(): React.ReactElement<IBusinessFranceTimeLineProps> {
    moment.locale('fr');
    moment.locale();

    return (
      <div style={divStyle}>
        <Stack tokens={stackTokens}>
          <Dropdown
            placeholder='Select Direction'
            label='Direction'
            options={this.state.options}
            styles={dropdownStyles}
            onChange={this.onChangeHandler}
          />
        </Stack>
        <VerticalTimeline>
          {
            this.state.filteredActivities.map((activity, i) => {
              let start = moment(activity.acivitySDate).format('Do MMMM');
              let finish = moment(activity.acivityEDate).format('Do MMMM');
              return (
                <VerticalTimelineElement
                  className='vertical-timeline-element--work'
                  date={start + '-' + finish + '\n' + activity.activityTitle}
                  iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                //icon={}  
                >
                  <h3 className='vertical-timeline-element-title'>{'Direction: ' + activity.activityDirection}</h3>
                  <h4 className='vertical-timeline-element-subtitle'>{'Pilote: ' + activity.activityPilote}</h4>
                  <p>
                    {'Description: ' + activity.activityDescription}
                  </p>
                  <p>
                    {'Actions: ' + activity.activityActions}
                  </p>
                  <a href={activity.activityLink}>Link to item</a>
                </VerticalTimelineElement>
              );
            })}
        </VerticalTimeline>
      </div>
    );
  }

  public componentDidMount(): void {
    this.TimelineService.getTimelineActivities('Events', 'asc').then((activities: ITimelineActivity[]) => {
      this.setState({
        timelineActivities: activities,
        filteredActivities: activities
      });
    }).catch((error: any) => {
      this.setState({ timelineActivities: [] });
    });

    this.TimelineService.getTimelineOptions('Events', 'asc').then((options: IDropdownOption[]) => {
      this.setState({
        options: options,
      });
    }).catch((error: any) => {
      this.setState({ options: [] });
    });

  }

  public componentWillReceiveProps(nextProps: IBusinessFranceTimeLineProps) {
    if (this.props.datetime !== nextProps.datetime) {
      this.TimelineService.getTimelineActivities('Events', 'asc', nextProps.datetime.value).then((activities: ITimelineActivity[]) => {
        this.setState({
          timelineActivities: activities,
          filteredActivities: activities
        });
      }).catch((error: any) => {
        this.setState({ timelineActivities: [] });
      });
      this.TimelineService.getTimelineOptions('Events', 'asc', nextProps.datetime.value).then((options: IDropdownOption[]) => {
        this.setState({ options: options });
      }).catch((error: any) => {
        this.setState({ options: [] });
      });
    }
  }
}



