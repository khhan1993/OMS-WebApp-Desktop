import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Segment, Loader, Dimmer } from 'semantic-ui-react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';


class Statistics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "is_loading": true,
      "menu_list": [],
      "statistics_data": null
    };
  }

  componentDidMount() {
    this.getStatisticData();
    this.getMenuList();
  }

  getStatisticData = () => {
    let url = this.props.api_url + "/api/statistics?group_id=" + (this.props.group_id).toString() + "&jwt=" + this.props.jwt;
    this.setState({
      "is_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "is_loading": false,
          "statistics_data": response.data
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  getMenuList = () => {
    let url = this.props.api_url + "/api/menu?group_id=" + (this.props.group_id).toString() + "&jwt=" + this.props.jwt;
    this.setState({
      "is_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "menu_list": response.data.list,
          "is_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  generateOrderStatusFromLast24Hours = () => {
    let labels = [];
    for(let itr = 23; itr >= 0; itr--) {
      let date = new Date();
      let label = date.getHours() - itr;
      if(label < 0) {
        label += 24;
      }

      labels.push(label.toString() + "시");
    }
    let cnt_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    if(this.state.statistics_data !== null) {
      for(let data of this.state.statistics_data.order_status_per_hour) {
        let idx = parseInt(data['time_elapsed'], 10);
        if(idx >= 0 && idx < 24) {
          cnt_data[23 - idx] = parseInt(data['cnt'], 10);
        }
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "주문 횟수",
          fill: true,
          lineTension: 0.1,
          backgroundColor: "rgba(0,255,0,1)",
          borderColor: "rgba(0,255,0,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: "rgba(0,255,0,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(0,255,0,0.75)",
          pointHoverBorderColor: "rgba(0,255,0,0.75)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: cnt_data,
          spanGaps: true,
        }
      ]
    };
  };

  generateSalesPerMenu = () => {
    let labels = [];
    let sales_data = [];

    for(let item of this.state.menu_list) {
      labels.push(item['name']);

      if(this.state.statistics_data !== null) {
        let is_value_assigned = false;
        for(let sale of this.state.statistics_data.sales_per_menu) {
          if(parseInt(sale['menu_id'], 10) === parseInt(item['id'], 10)) {
            sales_data.push(sale['cnt']);
            is_value_assigned = true;
            break;
          }
        }
        if(!is_value_assigned) {
          sales_data.push(0);
        }
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "판매 비율 (%)",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(255,255,255,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: sales_data,
          spanGaps: true,
        }
      ]
    };
  };

  generateDelaysPerMenu = () => {
    let labels = [];
    let delay_data = [];

    for(let item of this.state.menu_list) {
      labels.push(item['name']);

      if(this.state.statistics_data !== null) {
        let is_value_assigned = false;
        for(let delay of this.state.statistics_data.delays_per_menu) {
          if(parseInt(delay['menu_id'], 10) === parseInt(item['id'], 10)) {
            let delayed_time = parseInt(Math.round(parseFloat(delay['avg_delay']) / 60.0), 10);
            delay_data.push(delayed_time);
            is_value_assigned = true;
            break;
          }
        }
        if(!is_value_assigned) {
          delay_data.push(0);
        }
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "평균 준비 시간 (분)",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(255,187,0,0.4)",
          borderColor: "rgba(255,255,255,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: delay_data,
          spanGaps: true,
        }
      ]
    };
  };

  generateMemberOrderRanking = () => {
    let labels = [];
    let data = [];

    if(this.state.statistics_data !== null) {
      for(let rank of this.state.statistics_data.order_rank_list) {
        labels.push(rank['name']);
        data.push(rank['cnt']);
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: "주문 받은 횟수",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(127,127,127,0.4)",
          borderColor: "rgba(255,255,255,1)",
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          data: data,
          spanGaps: true,
        }
      ]
    };
  };

  render() {
    return (
      <Grid container columns="equal">
        <Grid.Row centered>
          <Grid.Column>
            <Segment>
              <Dimmer active={this.state.is_loading} inverted>
                <Loader active={this.state.is_loading} />
              </Dimmer>

              <Header as="h3" textAlign="center">시간대별 주문 현황</Header>

              <Line data={this.generateOrderStatusFromLast24Hours()} height={50} />
            </Segment>

            <Segment>
              <Dimmer active={this.state.is_loading} inverted>
                <Loader active={this.state.is_loading} />
              </Dimmer>

              <Header as="h3" textAlign="center">메뉴별 판매량</Header>

              <Bar data={this.generateSalesPerMenu()} height={50} />
            </Segment>

            <Segment>
              <Dimmer active={this.state.is_loading} inverted>
                <Loader active={this.state.is_loading} />
              </Dimmer>

              <Header as="h3" textAlign="center">메뉴별 평균 준비 시간</Header>

              <Bar data={this.generateDelaysPerMenu()} height={50} />
            </Segment>

            <Segment>
              <Dimmer active={this.state.is_loading} inverted>
                <Loader active={this.state.is_loading} />
              </Dimmer>

              <Header as="h3" textAlign="center">멤버 간 주문 순위</Header>

              <Bar data={this.generateMemberOrderRanking()} height={50} />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url,
    "group_id": state.auth.group_id
  }
};

export default connect(
  mapStateToProps
)(Statistics);
