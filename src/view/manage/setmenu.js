import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Form, Input, Table, Icon, Segment, Loader, Dimmer, Label } from 'semantic-ui-react';
import axios from 'axios';

class ManageSetmenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "new_name": "",
      "new_price": 0,
      "new_menu_list": [],
      "setmenu_list": [],
      "menu_list": [],
      "is_menu_list_loading": true,
      "is_setmenu_list_loading": true,
      "is_setmenu_on_creation": false
    };
  }

  componentDidMount() {
    this.getMenuList();
    this.getSetmenuList();
  }

  handleNewSetmenuNameChange = (e) => {
    this.setState({
      "new_name": e.target.value
    });
  };

  handleNewSetmenuPriceChange = (e) => {
    this.setState({
      "new_price": parseInt(e.target.value, 10)
    });
  };

  getMenuList = () => {
    let url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    axios.get(url)
      .then((response) => {
        this.setState({
          "menu_list": response.data.list,
          "is_menu_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  getSetmenuList = () => {
    let url = this.props.api_url + "/api/setmenu?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    axios.get(url)
      .then((response) => {
        this.setState({
          "setmenu_list": response.data.list,
          "is_setmenu_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  handleChangePrice = (setmenuItem, e) => {
    setmenuItem.price = parseInt(e.target.value, 10);
  };

  handleOnBlur = (setmenuItem) => {
    let url = this.props.api_url + "/api/setmenu/" + (setmenuItem.id).toString() + "?jwt=" + this.props.jwt;

    this.setState({
      "is_setmenu_list_loading": true
    });

    axios.put(url, {
      "price": parseInt(setmenuItem.price, 10),
      "is_enabled": parseInt(setmenuItem.is_enabled, 10)
    }).then((response) => {
      this.setState({
        "is_setmenu_list_loading": false
      });
    }).catch((error) => {
      alert(error.response.data.message);
    });
  };

  handleStateChange = (setmenuItem, next_state) => {
    if(parseInt(setmenuItem.is_enabled, 10) !== next_state) {
      let url = this.props.api_url + "/api/setmenu/" + (setmenuItem.id).toString() + "?jwt=" + this.props.jwt;

      this.setState({
        "is_setmenu_list_loading": true
      });

      axios.put(url, {
        "price": parseInt(setmenuItem.price, 10),
        "is_enabled": next_state
      }).then((response) => {
        setmenuItem.is_enabled = next_state;

        this.setState({
          "is_setmenu_list_loading": false,
          "setmenu_list": this.state.setmenu_list
        });
      }).catch((error) => {
        alert(error.response.data.message);
      });
    }
  };

  handleAddMenuToSet = (menuItem) => {
    let new_menu_list = this.state.new_menu_list;
    new_menu_list.push({
      "key": this.state.new_menu_list.length,
      "id": menuItem.id,
      "name": menuItem.name
    });

    this.setState({
      "new_menu_list": new_menu_list
    });
  };

  handleNewSetmenuSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_setmenu_on_creation": true
    });

    let url = this.props.api_url + "/api/setmenu?jwt=" + this.props.jwt;
    let new_menu_list = [];
    for(let item of this.state.new_menu_list) {
      new_menu_list.push(item.id);
    }

    axios.post(url, {
      "group_id": this.props.group_id,
      "name": this.state.new_name,
      "price": this.state.new_price,
      "menu_list": new_menu_list
    }).then((response) => {
      this.setState({
        "new_name": "",
        "new_price": 0,
        "new_menu_list": [],
        "is_setmenu_list_loading": true,
        "is_setmenu_on_creation": false
      });

      this.getSetmenuList();
    }).catch((error) => {
      alert(error.response.data.message);
    });
  };

  render() {
    let setmenuItems = this.state.setmenu_list.map((setmenuItem) =>
      <Table.Row key={setmenuItem.id}>
        <Table.Cell>{setmenuItem.name}</Table.Cell>
        <Table.Cell selectable><Input fluid transparent type="number" defaultValue={setmenuItem.price} onChange={(e) => this.handleChangePrice(setmenuItem, e)} onBlur={(e) => this.handleOnBlur(setmenuItem)} placeholder='가격 입력' /></Table.Cell>
        <Table.Cell active={parseInt(setmenuItem.is_enabled, 10) === 1} selectable onClick={(e) => this.handleStateChange(setmenuItem, 1)}><Icon name='checkmark' size='large' /></Table.Cell>
        <Table.Cell active={parseInt(setmenuItem.is_enabled, 10) === 0} selectable onClick={(e) => this.handleStateChange(setmenuItem, 0)}><Icon name='remove' size='large' /></Table.Cell>
      </Table.Row>
    );

    let menuItems = this.state.menu_list.map((menuItem) =>
      <Table.Row key={menuItem.id}>
        <Table.Cell>{menuItem.name}</Table.Cell>
        <Table.Cell>{menuItem.price}</Table.Cell>
        <Table.Cell selectable onClick={(e) => this.handleAddMenuToSet(menuItem)} ><Icon name='add' size='large' /></Table.Cell>
      </Table.Row>
    );

    let new_set_items = this.state.new_menu_list.map((new_menu) =>
      <Label key={new_menu.key}>{new_menu.name}</Label>
    );

    return (
      <Grid divided='vertically'>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment>
              <Dimmer active={this.state.is_setmenu_list_loading} inverted>
                <Loader active={this.state.is_setmenu_list_loading} />
              </Dimmer>

              <Header as="h2" textAlign="center">세트메뉴 목록</Header>
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell>가격</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">상태</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {setmenuItems}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <Dimmer active={this.state.is_menu_list_loading || this.state.is_setmenu_on_creation} inverted>
                <Loader active={this.state.is_menu_list_loading || this.state.is_setmenu_on_creation} />
              </Dimmer>

              <Header as="h2" textAlign="center">새 세트메뉴 등록</Header>
              <Form onSubmit={this.handleNewSetmenuSubmit}>
                <Form.Field>
                  <label>이름</label>
                  <Input type="text" value={this.state.new_name} onChange={this.handleNewSetmenuNameChange} placeholder='이름 입력' required />
                </Form.Field>

                <Form.Field>
                  <label>가격</label>
                  <Input type="number" value={this.state.new_price} onChange={this.handleNewSetmenuPriceChange} placeholder='가격 입력' required />
                </Form.Field>

                <Form.Field>
                  <label>
                    선택된 메뉴 &nbsp;
                    {this.state.new_menu_list.length > 0 &&
                    <Label color='red' horizontal onClick={(e) => {this.setState({"new_menu_list": []});}}>초기화</Label>
                    }
                  </label>
                  <Segment>
                    {new_set_items}
                  </Segment>
                </Form.Field>

                <Form.Field>
                  <label>메뉴 목록</label>
                  <Table celled textAlign="center" size="small">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>이름</Table.HeaderCell>
                        <Table.HeaderCell>가격</Table.HeaderCell>
                        <Table.HeaderCell>추가하기</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {menuItems}
                    </Table.Body>
                  </Table>
                </Form.Field>

                <Button fluid type='submit' disabled={this.state.new_menu_list.length === 0}>추가하기</Button>
              </Form>
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
)(ManageSetmenu);