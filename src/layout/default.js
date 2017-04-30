import React from 'react';
import { Menu, Container, Dropdown, Header, Modal, Button, Input, Form } from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, browserHistory } from 'react-router';

import authAction from '../action/index';
const { signIn, signOut } = authAction.auth;

class Default extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "name": "",
      "email": "",
      "password": ""
    };

    this.handleSigninSubmit = this.handleSigninSubmit.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  handleSigninSubmit(e) {
    e.preventDefault();

    let url = this.props.api_url + "/api/user?type=signin";

    axios.post(url, {
      "email": this.state.email,
      "password": this.state.password
    }).then((response) => {
      this.props.signIn(response.data.jwt);
      this.setState({
        "name": "",
        "email": "",
        "password": ""
      });
      browserHistory.push("/group");
    }).catch((error) => {
      alert(error.response.data.message);
    });
  }

  handleSignoutClick(e) {
    browserHistory.push("/main");
    this.props.signOut();
  }

  handleEmailChange(e) {
    this.setState({
      "email": e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      "password": e.target.value
    });
  }

  render() {
    return (
      <Container>
        <div>
          <Menu pointing secondary>
            <Menu.Item name="주문관리시스템" />
            <Link to="/main"><Menu.Item name='메인' className={this.activeRoute("/main")} /></Link>


            {this.props.jwt !== null &&
            <Link to="/group"><Menu.Item name='그룹' className={this.activeRoute("/group")} /></Link>
            }

            {this.props.jwt !== null && this.props.group_id !== null &&
            <Dropdown item text='주문'>
              <Dropdown.Menu>
                <Dropdown.Item>주문 입력</Dropdown.Item>
                <Dropdown.Item>주문 내역</Dropdown.Item>
                {this.props.role > 0 &&
                <Dropdown.Item>주문 처리</Dropdown.Item>
                }
              </Dropdown.Menu>
            </Dropdown>
            }

            {this.props.jwt !== null && this.props.group_id !== null &&
            <Menu.Item name="대기열" />
            }

            {this.props.jwt !== null && this.props.group_id !== null &&
            <Menu.Item name="통계" />
            }

            {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 &&
            <Dropdown item text='관리'>
              <Dropdown.Menu>
                <Dropdown.Item>메뉴 관리</Dropdown.Item>
                <Dropdown.Item>세트메뉴 관리</Dropdown.Item>
                <Dropdown.Item>멤버 관리</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            }

            <Menu.Menu position='right'>
              {this.props.jwt === null &&
              <Modal trigger={<Menu.Item name='로그인' />} size='small'>
                <Header icon='sign in' content='로그인' />
                <Modal.Content>
                  <Form onSubmit={this.handleSigninSubmit}>
                    <Form.Field>
                      <label>이메일</label>
                      <Input type="email" value={this.state.email} onChange={this.handleEmailChange} placeholder='이메일 입력' required />
                    </Form.Field>

                    <Form.Field>
                      <label>비밀번호</label>
                      <Input type="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder='비밀번호 입력' required />
                    </Form.Field>
                    <Button type='submit'>로그인</Button>
                  </Form>
                </Modal.Content>
              </Modal>
              }

              {this.props.jwt === null &&
              <Modal trigger={<Menu.Item name='회원가입' />} size='small'>
                <Header icon='add user' content='회원가입' />
                <Modal.Content>
                  <Form>
                    <Form.Field>
                      <label>이름</label>
                      <Input type="text" placeholder='이름 입력' />
                    </Form.Field>

                    <Form.Field>
                      <label>이메일</label>
                      <Input type="email" placeholder='이메일 입력' />
                    </Form.Field>

                    <Form.Field>
                      <label>비밀번호</label>
                      <Input type="password" placeholder='비밀번호 입력' />
                    </Form.Field>
                    <Button type='submit'>제출</Button>
                  </Form>
                </Modal.Content>
              </Modal>
              }

              {this.props.jwt !== null &&
              <Menu.Item name='로그아웃' onClick={this.handleSignoutClick} />
              }
            </Menu.Menu>
          </Menu>
        </div>

        <br/>

        {this.props.children}

        <br/>

        <Header as="h5" textAlign="center" color="grey">
          &copy; 2014 - 2017 한양대학교 한기훈
        </Header>
      </Container>
    );
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
    "signIn": (jwt) => {
      dispatch(signIn(jwt));
    },
    "signOut": () => {
      dispatch(signOut());
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Default);