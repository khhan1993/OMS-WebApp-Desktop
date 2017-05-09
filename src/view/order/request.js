import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Form, Input, Table, Icon, Segment, Loader, Dimmer } from 'semantic-ui-react';
import axios from 'axios';

class OrderRequest extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "menu_list": [],
      "setmenu_list": [],
      "is_menu_list_loading": true,
      "is_setmenu_list_loading": true,
      "is_in_order_processing": false,
      "table_name": "",
      "total_price": 0
    };
  }

  componentDidMount() {
    this.getMenuList();
    this.getSetmenuList();
  }

  getMenuList = () => {
    let url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_menu_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "menu_list": response.data.list,
          "is_menu_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_menu_list_loading": false
        });
      });
  };

  getSetmenuList = () => {
    let url = this.props.api_url + "/api/setmenu?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_setmenu_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "setmenu_list": response.data.list,
          "is_setmenu_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_setmenu_list_loading": false
        });
      });
  };

  handleMenuItemAdjust = (menuItem, value) => {
    if(isNaN(menuItem.amount)) {
      menuItem.amount = 0;
    }

    menuItem.amount += value;

    this.setState({
      "menu_list": this.state.menu_list,
      "total_price": this.state.total_price + (value * menuItem.price)
    });
  };

  handleSetmenuItemAdjust = (setmenuItem, value) => {
    if(isNaN(setmenuItem.amount)) {
      setmenuItem.amount = 0;
    }

    setmenuItem.amount += value;

    this.setState({
      "setmenu_list": this.state.setmenu_list,
      "total_price": this.state.total_price + (value * setmenuItem.price)
    });
  };

  handleTableNameChange = (e) => {
    this.setState({
      "table_name": e.target.value
    })
  };

  handleOnSubmit = (e) => {
    e.preventDefault();

    let url = this.props.api_url + "/api/order?jwt=" + this.props.jwt;

    let menu_list = [];
    for(let menu of this.state.menu_list) {
      if(!isNaN(menu.amount) && menu.amount !== 0) {
        menu_list.push({
          "id": menu.id,
          "amount": menu.amount
        });
      }
    }

    let setmenu_list = [];
    for(let setmenu of this.state.setmenu_list) {
      if(!isNaN(setmenu.amount) && setmenu.amount !== 0) {
        setmenu_list.push({
          "id": setmenu.id,
          "amount": setmenu.amount
        });
      }
    }

    if(menu_list.length === 0 && setmenu_list.length === 0) {
      alert("선택된 메뉴/세트메뉴 가 하나도 없습니다!");
    }
    else {
      this.setState({
        "is_in_order_processing": true
      });

      axios.post(url, {
        "group_id": this.props.group_id,
        "table_id": this.state.table_name,
        "menu_list": menu_list,
        "setmenu_list": setmenu_list
      }).then((response) => {
        let alert_msg = "주문 요청이 완료되었습니다.\n";
        alert_msg += "주문번호 : " + (response.data.order_id).toString() + "\n";
        alert_msg += "총 금액 : " + (response.data.total_price).toString();

        alert(alert_msg);

        for(let menu of this.state.menu_list) {
          if(!isNaN(menu.amount)) {
            delete menu.amount;
          }
        }

        for(let setmenu of this.state.setmenu_list) {
          if(!isNaN(setmenu.amount)) {
            delete setmenu.amount;
          }
        }

        this.setState({
          "is_in_order_processing": false,
          "table_name": "",
          "total_price": 0,
          "menu_list": this.state.menu_list,
          "setmenu_list": this.state.setmenu_list
        });
      }).catch((error) => {
        alert(error.response.data.message);

        this.setState({
          "is_in_order_processing": false
        });

        this.getMenuList();
        this.getSetmenuList();
      });
    }
  };

  render() {
    let menuItems = this.state.menu_list.map((menuItem) =>
      <Table.Row key={menuItem.id} disabled={parseInt(menuItem.is_enabled, 10) !== 1}>
        <Table.Cell>{menuItem.name}</Table.Cell>
        <Table.Cell>{menuItem.price}</Table.Cell>
        <Table.Cell>{menuItem.amount}</Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleMenuItemAdjust(menuItem, 1)}><Icon name='plus' size='large' /></Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleMenuItemAdjust(menuItem, -1)}><Icon name='minus' size='large' /></Table.Cell>
      </Table.Row>
    );

    let menuItemsMobile = this.state.menu_list.map((menuItem) =>
      <Table.Row key={menuItem.id} disabled={parseInt(menuItem.is_enabled, 10) !== 1}>
        <Table.Cell>{menuItem.name}</Table.Cell>
        <Table.Cell>{menuItem.amount}</Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleMenuItemAdjust(menuItem, 1)}><Icon name='plus' size='large' /></Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleMenuItemAdjust(menuItem, -1)}><Icon name='minus' size='large' /></Table.Cell>
      </Table.Row>
    );

    let setmenuItems = this.state.setmenu_list.map((setmenuItem) =>
      <Table.Row key={setmenuItem.id} disabled={parseInt(setmenuItem.is_enabled, 10) !== 1}>
        <Table.Cell>{setmenuItem.name}</Table.Cell>
        <Table.Cell>{setmenuItem.price}</Table.Cell>
        <Table.Cell>{setmenuItem.amount}</Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleSetmenuItemAdjust(setmenuItem, 1)}><Icon name='plus' size='large' /></Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleSetmenuItemAdjust(setmenuItem, -1)}><Icon name='minus' size='large' /></Table.Cell>
      </Table.Row>
    );

    let setmenuItemsMobile = this.state.setmenu_list.map((setmenuItem) =>
      <Table.Row key={setmenuItem.id} disabled={parseInt(setmenuItem.is_enabled, 10) !== 1}>
        <Table.Cell>{setmenuItem.name}</Table.Cell>
        <Table.Cell>{setmenuItem.amount}</Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleSetmenuItemAdjust(setmenuItem, 1)}><Icon name='plus' size='large' /></Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleSetmenuItemAdjust(setmenuItem, -1)}><Icon name='minus' size='large' /></Table.Cell>
      </Table.Row>
    );

    return (
      <Grid container columns="equal">
        <Grid.Row centered only="computer tablet">
          <Grid.Column width={8}>
            <Segment>
              <Dimmer active={this.state.is_setmenu_list_loading || this.state.is_menu_list_loading || this.state.is_in_order_processing} inverted>
                <Loader active={this.state.is_setmenu_list_loading || this.state.is_menu_list_loading || this.state.is_in_order_processing} />
              </Dimmer>

              <Form onSubmit={this.handleOnSubmit}>
                <Header as="h3" textAlign="center">메뉴 목록</Header>
                <Table celled textAlign="center" size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>이름</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell>수량</Table.HeaderCell>
                      <Table.HeaderCell colSpan="2">수량 조절</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {menuItems}
                  </Table.Body>
                </Table>

                <Header as="h3" textAlign="center">세트메뉴 목록</Header>
                <Table celled textAlign="center" size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>이름</Table.HeaderCell>
                      <Table.HeaderCell>가격</Table.HeaderCell>
                      <Table.HeaderCell>수량</Table.HeaderCell>
                      <Table.HeaderCell colSpan="2">수량 조절</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {setmenuItems}
                  </Table.Body>
                </Table>

                <Header as="h3" textAlign="center">테이블 이름</Header>
                <Input type="text" fluid value={this.state.table_name} onChange={this.handleTableNameChange} placeholder='테이블 이름 입력' required />

                <br/>

                <Button.Group fluid size='large'>
                  <Button>총 가격 : {this.state.total_price}</Button>
                  <Button primary type="submit">주문 요청</Button>
                </Button.Group>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered only="mobile">
          <Grid.Column width={15}>
            <Segment>
              <Dimmer active={this.state.is_setmenu_list_loading || this.state.is_menu_list_loading || this.state.is_in_order_processing} inverted>
                <Loader active={this.state.is_setmenu_list_loading || this.state.is_menu_list_loading || this.state.is_in_order_processing} />
              </Dimmer>

              <Form onSubmit={this.handleOnSubmit}>
                <Header as="h3" textAlign="center">메뉴 목록</Header>
                <Table celled unstackable textAlign="center" size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>이름</Table.HeaderCell>
                      <Table.HeaderCell>수량</Table.HeaderCell>
                      <Table.HeaderCell colSpan="2">수량 조절</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {menuItemsMobile}
                  </Table.Body>
                </Table>

                <Header as="h3" textAlign="center">세트메뉴 목록</Header>
                <Table celled unstackable textAlign="center" size="small">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>이름</Table.HeaderCell>
                      <Table.HeaderCell>수량</Table.HeaderCell>
                      <Table.HeaderCell colSpan="2">수량 조절</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {setmenuItemsMobile}
                  </Table.Body>
                </Table>

                <Header as="h3" textAlign="center">테이블 이름</Header>
                <Input type="text" fluid value={this.state.table_name} onChange={this.handleTableNameChange} placeholder='테이블 이름 입력' required />

                <br/>

                <Button.Group fluid size='large'>
                  <Button>총 가격 : {this.state.total_price}</Button>
                  <Button primary type="submit">주문 요청</Button>
                </Button.Group>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
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
)(OrderRequest);
