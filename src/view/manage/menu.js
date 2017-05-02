import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Form, Input, Table, Icon, Segment, Loader, Dimmer } from 'semantic-ui-react';
import axios from 'axios';

class ManageMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "new_name": "",
      "new_price": 0,
      "menu_list": [],
      "is_list_loading": true,
      "is_menu_on_creation": false
    };
  }

  componentDidMount() {
    this.getMenuList();
  }

  handleNewMenuNameChange = (e) => {
    this.setState({
      "new_name": e.target.value
    });
  };

  handleNewMenuPriceChange = (e) => {
    this.setState({
      "new_price": parseInt(e.target.value, 10)
    });
  };

  handleNewMenuSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_menu_on_creation": true
    });

    let url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt;

    axios.post(url, {
      "group_id": this.props.group_id,
      "name": this.state.new_name,
      "price": this.state.new_price
    }).then((response) => {
      this.setState({
        "new_name": "",
        "new_price": 0,
        "is_list_loading": true,
        "is_menu_on_creation": false
      });

      this.getMenuList();
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_menu_on_creation": false
      });
    });
  };

  getMenuList = () => {
    let url = this.props.api_url + "/api/menu?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "menu_list": response.data.list,
          "is_list_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        });
      });
  };

  handleChangePrice = (menuItem, e) => {
    menuItem.price = parseInt(e.target.value, 10);
  };

  handleOnBlur = (menuItem) => {
    let url = this.props.api_url + "/api/menu/" + (menuItem.id).toString() + "?jwt=" + this.props.jwt;

    this.setState({
      "is_list_loading": true
    });

    axios.put(url, {
      "price": parseInt(menuItem.price, 10),
      "is_enabled": parseInt(menuItem.is_enabled, 10)
    }).then((response) => {
      this.setState({
        "is_list_loading": false
      });
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_list_loading": false
      });
    });
  };

  handleStateChange = (menuItem, next_state) => {
    if(parseInt(menuItem.is_enabled, 10) !== next_state) {
      let url = this.props.api_url + "/api/menu/" + (menuItem.id).toString() + "?jwt=" + this.props.jwt;

      this.setState({
        "is_list_loading": true
      });

      axios.put(url, {
        "price": parseInt(menuItem.price, 10),
        "is_enabled": next_state
      }).then((response) => {
        menuItem.is_enabled = next_state;

        this.setState({
          "is_list_loading": false,
          "menu_list": this.state.menu_list
        });
      }).catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        });
      });
    }
  };

  render() {
    let menuItems = this.state.menu_list.map((menuItem) =>
      <Table.Row key={menuItem.id}>
        <Table.Cell>{menuItem.name}</Table.Cell>
        <Table.Cell selectable><Input fluid transparent type="number" defaultValue={menuItem.price} onChange={(e) => this.handleChangePrice(menuItem, e)} onBlur={(e) => this.handleOnBlur(menuItem)} placeholder='가격 입력' /></Table.Cell>
        <Table.Cell active={parseInt(menuItem.is_enabled, 10) === 1} selectable onClick={(e) => this.handleStateChange(menuItem, 1)}><Icon name='checkmark' size='large' /></Table.Cell>
        <Table.Cell active={parseInt(menuItem.is_enabled, 10) === 0} selectable onClick={(e) => this.handleStateChange(menuItem, 0)}><Icon name='remove' size='large' /></Table.Cell>
      </Table.Row>
    );

    return (
      <Grid divided='vertically'>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading} />
              </Dimmer>

              <Header as="h2" textAlign="center">메뉴 목록</Header>
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell>가격</Table.HeaderCell>
                    <Table.HeaderCell colSpan="2">상태</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {menuItems}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <Dimmer active={this.state.is_menu_on_creation} inverted>
                <Loader active={this.state.is_menu_on_creation} />
              </Dimmer>

              <Header as="h2" textAlign="center">새 메뉴 등록</Header>
              <Form onSubmit={this.handleNewMenuSubmit}>
                <Form.Field>
                  <label>이름</label>
                  <Input type="text" value={this.state.new_name} onChange={this.handleNewMenuNameChange} placeholder='이름 입력' required />
                </Form.Field>

                <Form.Field>
                  <label>가격</label>
                  <Input type="number" value={this.state.new_price} onChange={this.handleNewMenuPriceChange} placeholder='가격 입력' required />
                </Form.Field>

                <Button fluid type='submit'>추가하기</Button>
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
)(ManageMenu);