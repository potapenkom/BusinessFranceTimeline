/*import * as React from 'react';
import styles from './BusinessFranceTimeLine.module.scss';
import { IBusinessFranceTimeLineProps } from './IBusinessFranceTimeLineProps';
import { IBusinessFranceTimeLineState } from './IBusinessFranceTimeLineState';
import { Callout } from '@fluentui/react';
import { Link } from '@fluentui/react';
import 'react-vertical-timeline-component/style.min.css';
import './mystyle.css';
import TimelineService from '../../../services/TimelineService';
import { ITimelineActivity } from '../../../models/ITimelineActivity';
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
  private menuButtonElement: HTMLElement;
  constructor(props: IBusinessFranceTimeLineProps) {
    super(props);

    this.state = {
      timelineActivities: [],
      options: [],
      filteredActivities: [],
      isloading: false,
    
    };

    this.TimelineService = new TimelineService(this.props.spcontext);
    this.onDismissPanel = this.onDismissPanel.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.getFilteredList = this.getFilteredList.bind(this);
    
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
        {
          this.state.filteredActivities.map((activity, i) => {
            let start = moment(activity.acivitySDate).format('Do MMMM');
            let finish = moment(activity.acivityEDate).format('Do MMMM');
            return (
              <div className="ms-List" role="presentation">
                <div role="presentation" className="ms-List-surface">
                  <div className="ms-List-page" role="presentation">
                    <div role="presentation" className="ms-List-cell" data-list-index="0" data-automationid="ListCell">
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', height: '150px', width: '400px' }} className="sp-field-customFormatter">
                          <div style={{ fontSize: '20px', width: '50%', textAlign: 'center' }}>{`Date de d??but: ${start} - Date de fin: ${finish}`}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '50%' }}>
                            <div style={{ borderWidth: '2px', borderStyle: 'solid', height: '60px' }}
                              className="ms-borderColor-neutralSecondary" ></div>
                            <div className='ms-Callout-Custom'>
                              <div className='ms-CalloutBasicExample-buttonArea' ref={(menuButton) => this.menuButtonElement = menuButton}>
                                <div style={{ height: '30px', width: '30px', borderRadius: '50%', cursor: 'pointer', outline: 'none', backgroundColor: 'rgb(152, 111, 11)' }}
                                  data-custom-card-path="#.1.1" data-event-trigger="click" id="0_#.1.1_Title_0"
                                  data-is-focusable="true" className="ms-bgColor-themePrimary"></div>
                              </div>
                              {isCalloutVisible && (
                                <Callout
                                  className='ms-CalloutExample-callout'
                                  ariaLabelledBy={'callout-label-1'}
                                  ariaDescribedBy={'callout-description-1'}
                                  role={'alertdialog'}
                                  gapSpace={0}
                                  target={this.menuButtonElement}
                                  onDismiss={this.onCalloutDismiss}
                                  setInitialFocus={true}>
                                  <div style={{ display: 'flex', flexDirection: 'column', height: '200px', width: '450px' }} className="sp-field-customFormatter">
                                    <div style={{ height: '20%', width: '100%', backgroundColor: 'rgb(152, 111, 11)', color: 'white', fontSize: '20px', display: 'flex', alignItems: 'center', paddingLeft: '40px' }}
                                      className="ms-bgColor-themePrimary">
                                      <p>{`Date de d??but: ${start} - Date de fin: ${finish} `}</p>
                                      <p>${`Nom du temps fort: ${activity.activityTitle} `}</p>
                                    </div>
                                    <div className='callout-label-1' style={{ height: '80%', width: '90%', paddingTop: '10px', paddingLeft: '40px' }}>
                                      <p>{`Direction: ${activity.activityDirection}`} </p>
                                      <p>{`Pilote: ${activity.activityPilote}`}</p>
                                      <p>{`Description: ${activity.activityDescription}`}</p>
                                      <p>{`Actions ?? mener: ${activity.activityActions}`}</p>
                                      <a href={activity.activityLink}>Lien pour enregistrer</a>                             
                                    </div>
                                  </div>
                                </Callout>
                              )}
                            </div>
                            <div style={{ borderWidth: '2px', borderStyle: 'solid', height: '60px' }}
                              className="ms-borderColor-neutralSecondary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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



*/