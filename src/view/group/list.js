import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Table, Grid, Header, Icon, Button } from 'semantic-ui-react';

import authAction from '../../action/index';
const { selectGroup } = authAction.auth;

class GroupList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "list": [],
      "pagination": [],
      "cur_page": 1
    }
  }

  componentDidMount() {
    this.getGroupList(this.state.cur_page);
  }

  getGroupList(page) {
    let url = this.props.api_url + "/api/group?jwt=" + this.props.jwt + "&page=" + page.toString();

    axios.get(url)
      .then((response) => {
        this.setState({
          "list": response.data.list,
          "pagination": response.data.pagination
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  handleGetGroupListClick = (page_num) => {
    this.setState({
      "cur_page": page_num
    });

    this.getGroupList(page_num);
  };

  handleGroupSelectClick = (data) => {
    this.props.selectGroup(data.group_id, data.role);
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

  render() {
    let rowItems = this.state.list.map((rowItem) =>
      <Table.Row key={rowItem.id} active={rowItem.id === this.props.group_id}>
        <Table.Cell>{rowItem.id}</Table.Cell>
        <Table.Cell>{rowItem.name}</Table.Cell>
        <Table.Cell>{rowItem.role}</Table.Cell>
        <Table.Cell>{this.getDateString(rowItem.created_at)}</Table.Cell>
        <Table.Cell onClick={(e) => this.handleGroupSelectClick({"group_id": rowItem.id, "role": rowItem.role})}><Icon name='hand pointer' size='large' /></Table.Cell>
      </Table.Row>
    );

    let pageItems = this.state.pagination.map((page) =>
      <Button key={page.num} active={page.current === true} onClick={(e) => this.handleGetGroupListClick(page.num)}>
        {page.text}
      </Button>
    );

    return (
      <Grid columns="equal">
        <Grid.Row centered>
          <Grid.Column width={9}>
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
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered>
          <Button.Group>
            {pageItems}
          </Button.Group>
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
    "role": state.auth.role
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    "selectGroup": (group_id, role) => {
      dispatch(selectGroup(group_id, role));
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupList);