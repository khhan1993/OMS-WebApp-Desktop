import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Table, Grid, Header, Icon, Button, Segment, Dimmer, Loader, Label, Modal, Form, Input } from 'semantic-ui-react';

import authAction from '../../action/index';
const { selectGroup } = authAction.auth;

class GroupList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1,
      "is_list_loading": true,
      "is_group_signup_processing": false,
      "new_signup_group_id": "",
      "new_signup_code": ""
    }
  }

  componentDidMount() {
    this.getGroupList(this.state.cur_page);
  }

  getGroupList(page) {
    let url = this.props.api_url + "/api/group?jwt=" + this.props.jwt + "&page=" + page.toString();

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
  };

  handleGetGroupListClick = (page_num) => {
    this.setState({
      "cur_page": page_num
    });

    this.getGroupList(page_num);
  };

  handleGroupSelectClick = (data) => {

    this.props.selectGroup(data.group_id, data.role, data.signup_code);
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

  displayGroupPermission(role) {
    switch(role) {
      case 0:
        return (<Label><Icon name='user' /> 일반 멤버</Label>);

      case 1:
        return (<Label><Icon name='key' /> 중간 관리자</Label>);

      case 2:
        return (<Label><Icon name='wizard' /> 최고 관리자</Label>);

      default:
        return (<Label><Icon name='exclamation triangle' /> 알 수 없음</Label>);
    }
  }

  handleChangeGroupId = (e) => {
    this.setState({
      "new_signup_group_id": e.target.value
    });
  };

  handleChangeCode = (e) => {
    this.setState({
      "new_signup_code": e.target.value
    });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();

    let url = this.props.api_url + "/api/member?jwt=" + this.props.jwt;

    this.setState({
      "is_group_signup_processing": true
    });

    axios.post(url, {
      "group_id": this.state.new_signup_group_id,
      "signup_code": this.state.new_signup_code
    }).then((response) => {
      alert("그룹에 가입되었습니다.");
      this.setState({
        "is_group_signup_processing": false,
        "new_signup_group_id": "",
        "new_signup_code": ""
      });
      this.getGroupList(this.state.cur_page);
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_group_signup_processing": false
      });
    });
  };

  render() {
    let rowItems = this.state.list.map((rowItem) =>
      <Table.Row key={rowItem.id} active={rowItem.id === this.props.group_id}>
        <Table.Cell>{rowItem.id}</Table.Cell>
        <Table.Cell>{rowItem.name}</Table.Cell>
        <Table.Cell>{this.displayGroupPermission(rowItem.role)}</Table.Cell>
        <Table.Cell>{this.getDateString(rowItem.created_at)}</Table.Cell>
        <Table.Cell onClick={(e) => this.handleGroupSelectClick({"group_id": rowItem.id, "role": rowItem.role, "signup_code": rowItem.signup_code})}><Icon name='hand pointer' size='large' /></Table.Cell>
      </Table.Row>
    );

    let rowItemsMobile = this.state.list.map((rowItem) =>
      <Table.Row key={rowItem.id} active={rowItem.id === this.props.group_id}>
        <Table.Cell>{rowItem.name}</Table.Cell>
        <Table.Cell>{this.displayGroupPermission(rowItem.role)}</Table.Cell>
        <Table.Cell onClick={(e) => this.handleGroupSelectClick({"group_id": rowItem.id, "role": rowItem.role, "signup_code": rowItem.signup_code})}><Icon name='hand pointer' size='large' /></Table.Cell>
      </Table.Row>
    );

    let pageItems = this.state.pagination.map((page) =>
      <Button key={page.num} active={page.current === true} onClick={(e) => this.handleGetGroupListClick(page.num)}>
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

              <Header as="h2" textAlign="center">그룹 목록</Header>
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell>권한</Table.HeaderCell>
                    <Table.HeaderCell>생성일</Table.HeaderCell>
                    <Table.HeaderCell>선택</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rowItems}
                </Table.Body>
              </Table>

              <Button.Group fluid>
                {pageItems}
              </Button.Group>

              <Modal closeIcon trigger={<Button basic fluid>새 그룹에 가입하기</Button>} size='small'>
                <Header icon='group' content='새 그룹에 가입' />
                <Modal.Content>
                  <Form onSubmit={this.handleOnSubmit}>
                    <Form.Field>
                      <label>그룹 고유번호</label>
                      <Input type="number" placeholder='고유번호 입력' value={this.state.new_signup_group_id} onChange={this.handleChangeGroupId} required/>
                    </Form.Field>

                    <Form.Field>
                      <label>가입 인증코드</label>
                      <Input type="text" placeholder='인증코드 입력' value={this.state.new_signup_code} onChange={this.handleChangeCode} required />
                    </Form.Field>

                    <Button type='submit' loading={this.is_group_signup_processing}>가입</Button>
                  </Form>
                </Modal.Content>
              </Modal>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered only="mobile">
          <Grid.Column width={15}>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading}>목록 로딩 중...</Loader>
              </Dimmer>

              <Header as="h2" textAlign="center">그룹 목록</Header>
              <Table celled unstackable textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell>권한</Table.HeaderCell>
                    <Table.HeaderCell>선택</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rowItemsMobile}
                </Table.Body>
              </Table>

              <Button.Group fluid>
                {pageItems}
              </Button.Group>

              <Modal closeIcon trigger={<Button basic fluid>새 그룹에 가입하기</Button>} size='fullscreen'>
                <Header icon='group' content='새 그룹에 가입' />
                <Modal.Content>
                  <Form onSubmit={this.handleOnSubmit}>
                    <Form.Field>
                      <label>그룹 고유번호</label>
                      <Input type="number" placeholder='고유번호 입력' value={this.state.new_signup_group_id} onChange={this.handleChangeGroupId} required/>
                    </Form.Field>

                    <Form.Field>
                      <label>가입 인증코드</label>
                      <Input type="text" placeholder='인증코드 입력' value={this.state.new_signup_code} onChange={this.handleChangeCode} required />
                    </Form.Field>

                    <Button type='submit' loading={this.is_group_signup_processing}>가입</Button>
                  </Form>
                </Modal.Content>
              </Modal>
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
    "group_id": state.auth.group_id,
    "signup_code": state.auth.signup_code,
    "role": state.auth.role
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    "selectGroup": (group_id, role, signup_code) => {
      dispatch(selectGroup(group_id, role, signup_code));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupList);