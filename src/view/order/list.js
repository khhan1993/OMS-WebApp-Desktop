import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Table, Icon, Segment, Loader, Dimmer, Label } from 'semantic-ui-react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

class OrderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1,
      "is_list_loading": true,
      "remaining_refresh_time": 15,
      "auto_refresh_interval_ref": null
    }
  }

  componentDidMount() {
    this.getOrderList(1);
    this.setState({
      "auto_refresh_interval_ref": setInterval(this.autoRefresh, 1000)
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.auto_refresh_interval_ref);
  }

  autoRefresh = () => {
    if(this.state.remaining_refresh_time <= 0) {
      if(this.state.is_list_loading === false) {
        this.setState({
          "is_list_loading": true,
          "remaining_refresh_time": 9
        });

        this.getOrderList(this.state.cur_page);
      }
    }
    else {
      this.setState({
        "remaining_refresh_time": this.state.remaining_refresh_time - 1
      });
    }
  };

  getOrderList(page) {
    let url = this.props.api_url + "/api/order?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString() + "&page=" + page.toString();

    this.setState({
      "is_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "list": response.data.list,
          "pagination": response.data.pagination,
          "is_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        });
      });
  }

  handleGetOrderListClick = (page_num) => {
    this.setState({
      "cur_page": page_num,
      "remaining_refresh_time": 9
    });

    this.getOrderList(page_num);
  };

  getDateString(dateInfo) {
    let dateObj = new Date(dateInfo);

    let dateString = dateObj.getFullYear() + "년 ";
    dateString += (dateObj.getMonth() + 1).toString() + "월 ";
    dateString += dateObj.getDate() + "일 ";
    dateString += dateObj.getHours() + "시 ";
    dateString += dateObj.getMinutes() + "분";

    return dateString;
  };

  getStatusIcon(status) {
    switch(status) {
      case 1:
        return (<Icon name='checkmark' color="blue" size='large' />);

      case 0:
        return (<Icon name='question' size='large' />);

      case -1:
        return (<Icon name='remove' color="red" size='large' />);

      default:
        return null
    }
  }

  handleGetOrderInfo(orderItem) {
    orderItem.is_loading = true;
    this.setState({
      "list": this.state.list
    });

    let url = this.props.api_url + "/api/order/" + (orderItem.id).toString() + "?jwt=" + this.props.jwt;
    axios.get(url)
      .then((response) => {
        orderItem.is_loading = false;
        this.setState({
          "list": this.state.list
        });

        let alert_msg = "주문번호 : " + (response.data.order_id).toString() + "\n";

        alert_msg += "\n[일반메뉴]\n";
        for(let menu_info of response.data.order_menus) {
          alert_msg += (menu_info['name'] + " : " + menu_info['amount'] + "\n");
        }

        alert_msg += "\n[세트메뉴]\n";
        for(let setmenu_info of response.data.order_setmenus) {
          alert_msg += (setmenu_info['name'] + " : " + setmenu_info['amount'] + "\n");
        }

        alert(alert_msg);
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  render() {
    let rowItems = this.state.list.map((rowItem) =>
      <tr key={rowItem.id} negative={parseInt(rowItem.status, 10) === -1} positive={parseInt(rowItem.status, 10) === 1}>
        <td>{rowItem.id}</td>
        <td>{rowItem.name}</td>
        <td selectable onClick={(e) => this.handleGetOrderInfo(rowItem)}>
          <Label active={rowItem.is_loading === true}>눌러서 확인</Label>
        </td>
        <td>{rowItem.total_price}</td>
        <td>{rowItem.table_id}</td>
        <td>{this.getDateString(rowItem.created_at)}</td>
        <td>{this.getStatusIcon(rowItem.status)}</td>
      </tr>
    );

    let rowItemsMobile = this.state.list.map((rowItem) =>
      <tr key={rowItem.id} negative={parseInt(rowItem.status, 10) === -1} positive={parseInt(rowItem.status, 10) === 1}>
        <td>{rowItem.id}</td>
        <td selectable onClick={(e) => this.handleGetOrderInfo(rowItem)}>
          <Label active={rowItem.is_loading === true}>보기</Label>
        </td>
        <td>{rowItem.total_price}</td>
        <td>{rowItem.table_id}</td>
        <td>{this.getStatusIcon(rowItem.status)}</td>
      </tr>
    );


    let pageItems = this.state.pagination.map((page) =>
      <Button key={page.num} active={page.current === true} onClick={(e) => this.handleGetOrderListClick(page.num)}>
        {page.text}
      </Button>
    );

    return (
      <Grid container columns="equal">
        <Grid.Row centered only="computer tablet">
          <Grid.Column width={10}>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading}>목록 로딩 중...</Loader>
              </Dimmer>

              <Header as="h3" textAlign="center">
                주문 내역
                <Label>
                  <Icon name='time' /> {this.state.remaining_refresh_time}
                </Label>
              </Header>
              <Table responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>주문자명</th>
                    <th>내역</th>
                    <th>총 가격</th>
                    <th>테이블</th>
                    <th>시간</th>
                    <th>상태</th>
                  </tr>
                </thead>

                <tbody>
                  {rowItems}
                </tbody>
              </Table>

              <Button.Group fluid>
                {pageItems}
              </Button.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered only="mobile">
          <Grid.Column width={15}>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading}>목록 로딩 중...</Loader>
              </Dimmer>

              <Header as="h3" textAlign="center">
                주문 내역
                <Label>
                  <Icon name='time' /> {this.state.remaining_refresh_time}
                </Label>
              </Header>
              <Table celled unstackable textAlign="center" size="small">
                <Table.Header>
                  <tr>
                    <th>#</th>
                    <th>내역</th>
                    <th>가격</th>
                    <th>테이블</th>
                    <th>상태</th>
                  </tr>
                </Table.Header>

                <tbody>
                  {rowItemsMobile}
                </tbody>
              </Table>

              <Button.Group fluid>
                {pageItems}
              </Button.Group>
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
)(OrderList);