import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Form, Input, Table, Icon, Segment, Loader, Dimmer, Popup } from 'semantic-ui-react';
import axios from 'axios';

import authAction from '../../action/index';
const { selectGroup } = authAction.auth;

class ManageMember extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "new_signup_code": (this.props.signup_code ? this.props.signup_code : ""),
      "member_list": [],
      "is_list_loading": true,
      "is_on_update": false
    }
  }

  componentDidMount() {
    this.getMemberList();
  }

  getMemberList = () => {
    let url = this.props.api_url + "/api/member?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    this.setState({
      "is_list_loading": true
    });

    axios.get(url)
      .then((response) => {
        this.setState({
          "member_list": response.data.list,
          "is_list_loading": false,
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  handleChange = (e) => {
    this.setState({
      "new_signup_code": e.target.value
    });
  };

  handleOnSubmit = (e) => {
    e.preventDefault();

    let url = this.props.api_url + "/api/group/" + (this.props.group_id).toString() + "?jwt=" + this.props.jwt;

    this.setState({
      "is_on_update": true
    });

    axios.put(url, {
      "code": this.state.new_signup_code
    }).then((response) => {
      this.props.selectGroup(this.props.group_id, this.props.role, this.state.new_signup_code);
      this.setState({
        "is_on_update": false
      });
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_on_update": false
      });
    });
  };

  changeMemberRole = (member, role) => {
    if(parseInt(member.role, 10) !== role) {
      let url = this.props.api_url + "/api/member?jwt=" + this.props.jwt;

      this.setState({
        "is_list_loading": true
      });

      axios.put(url, {
        "group_id": this.props.group_id,
        "user_id": member.id,
        "role": role
      }).then((response) => {
        member.role = role;
        this.setState({
          "member_list": this.state.member_list,
          "is_list_loading": false
        });
      }).catch((error) => {
        alert(error.response.data.message);
        this.setState({
          "is_list_loading": false
        })
      });
    }
  };

  deleteMember = (member) => {
    if(confirm("이 멤버를 제거하시겠습니까?")) {
      let url = this.props.api_url + "/api/member?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString() + "&user_id=" + (member.id).toString();

      this.setState({
        "is_list_loading": true
      });

      axios.delete(url)
        .then((response) => {
          this.setState({
            "is_list_loading": false
          });
          this.getMemberList();
        })
        .catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_list_loading": false
          })
        });
    }
  };

  render() {
    let member_list = this.state.member_list.map((member) =>
      <Table.Row key={member.id}>
        <Table.Cell>{member.id}</Table.Cell>
        <Table.Cell>{member.name}</Table.Cell>
        <Table.Cell selectable active={parseInt(member.role, 10) === 0} onClick={(e) => this.changeMemberRole(member, 0)}>
          <Popup trigger={<Icon name='user' />} header="일반 유저" />
        </Table.Cell>
        <Table.Cell selectable active={parseInt(member.role, 10) === 1} onClick={(e) => this.changeMemberRole(member, 1)}>
          <Popup trigger={<Icon name='key' />} header="중간 관리자" />
        </Table.Cell>
        <Table.Cell selectable active={parseInt(member.role, 10) === 2} onClick={(e) => this.changeMemberRole(member, 2)}>
          <Popup trigger={<Icon name='wizard' />} header="최고 관리자" />
        </Table.Cell>
        <Table.Cell selectable onClick={(e) => this.deleteMember(member)}><Icon name="trash outline" /></Table.Cell>
      </Table.Row>
    );

    return (
      <Grid container>
        <Grid.Row centered columns={2} only="computer tablet">
          <Grid.Column width={7}>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading} />
              </Dimmer>

              <Header as="h2" textAlign="center">멤버 목록</Header>
              <Table celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell colSpan="3">권한</Table.HeaderCell>
                    <Table.HeaderCell>제거</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {member_list}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
          <Grid.Column width={7}>
            <Segment>
              <Dimmer active={this.state.is_on_update} inverted>
                <Loader active={this.state.is_on_update} />
              </Dimmer>

              <Header as="h2" textAlign="center">그룹 가입 정보 설정</Header>
              <Form onSubmit={this.handleOnSubmit}>
                <Form.Field>
                  <label>인증코드 (최대길이 64)</label>
                  <Input type="text" value={this.state.new_signup_code} onChange={this.handleChange} placeholder="인증코드 입력 (비울 경우 본 그룹 가입 중지)" required />
                </Form.Field>

                <Button fluid type='submit'>변경하기</Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered only="mobile">
          <Grid.Column width={15}>
            <Segment>
              <Dimmer active={this.state.is_list_loading} inverted>
                <Loader active={this.state.is_list_loading} />
              </Dimmer>

              <Header as="h2" textAlign="center">멤버 목록</Header>
              <Table unstackable celled textAlign="center">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>#</Table.HeaderCell>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell colSpan="3">권한</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {member_list}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered only="mobile">
          <Grid.Column width={15}>
            <Segment>
              <Dimmer active={this.state.is_on_update} inverted>
                <Loader active={this.state.is_on_update} />
              </Dimmer>

              <Header as="h2" textAlign="center">새 멤버 등록</Header>
              <Form onSubmit={this.handleOnSubmit}>
                <Form.Field>
                  <label>이메일 또는 회원번호</label>
                  <Input type="text" value={this.state.new_member_info} onChange={this.handleChange} placeholder='이름 또는 회원번호 입력' required />
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
    "group_id": state.auth.group_id,
    "signup_code": state.auth.signup_code
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
)(ManageMember);