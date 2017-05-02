import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Table, Icon, Segment, Loader, Dimmer, Label } from 'semantic-ui-react';
import axios from 'axios';

class OrderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1,
      "is_list_loading": true
    }
  }

  componentDidMount() {
    this.getOrderList(1);
  }

  getOrderList(page) {
    let url = this.props.api_url + "/api/order?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString() + "&page=" + page.toString();
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
      });
  }

  handleGetOrderListClick = (page_num) => {
    this.setState({
      "cur_page": page_num,
      "is_list_loading": true
    });

    this.getOrderList(page_num);
  };

  getDateString(dateInfo) {
    let dateObj = new Date(dateInfo);

    let dateString = dateObj.getUTCFullYear() + "년 ";
    dateString += (dateObj.getUTCMonth() + 1).toString() + "월 ";
    dateString += dateObj.getUTCDate() + "일 ";
    dateString += (parseInt(dateObj.getUTCHours(), 10) - (dateObj.getTimezoneOffset() / 60)).toString() + "시 ";
    dateString += dateObj.getUTCMinutes() + "분";

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
      <Table.Row key={rowItem.id}>
        <Table.Cell>{rowItem.id}</Table.Cell>
        <Table.Cell>{rowItem.name}</Table.Cell>
        <Table.Cell onClick={(e) => this.handleGetOrderInfo(rowItem)}>
          <Label active={rowItem.is_loading === true}>눌러서 확인</Label>
        </Table.Cell>
        <Table.Cell>{rowItem.total_price}</Table.Cell>
        <Table.Cell>{rowItem.table_id}</Table.Cell>
        <Table.Cell>{this.getDateString(rowItem.created_at)}</Table.Cell>
        <Table.Cell>{this.getStatusIcon(rowItem.status)}</Table.Cell>
      </Table.Row>
    );

    let pageItems = this.state.pagination.map((page) =>
      <Button key={page.num} active={page.current === true} onClick={(e) => this.handleGetOrderListClick(page.num)}>
        {page.text}
      </Button>
    );

    return (
      <Grid columns="equal">
        <Grid.Row centered>
          <Grid.Column width={10}>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading}>목록 로딩 중...</Loader>
              </Dimmer>

              <Header as="h3" textAlign="center">주문 내역</Header>
              <Table celled textAlign="center" size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>주문자명</Table.HeaderCell>
                    <Table.HeaderCell>내역</Table.HeaderCell>
                    <Table.HeaderCell>총 가격</Table.HeaderCell>
                    <Table.HeaderCell>테이블</Table.HeaderCell>
                    <Table.HeaderCell>시간</Table.HeaderCell>
                    <Table.HeaderCell>상태</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rowItems}
                </Table.Body>
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