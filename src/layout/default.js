import React from 'react';
import { Menu, Container, Dropdown, Header, Modal, Button, Input, Form} from 'semantic-ui-react';
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
      "password": "",
      "is_in_process": false
    };
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  handleSigninSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_in_process": true
    });

    let url = this.props.api_url + "/api/user?type=signin";

    axios.post(url, {
      "email": this.state.email,
      "password": this.state.password
    }).then((response) => {
      this.props.signIn(response.data.jwt);
      this.setState({
        "name": "",
        "email": "",
        "password": "",
        "is_in_process": false
      });
      browserHistory.push("/group");
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_in_process": false
      });
    });
  };

  handleSignupSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_in_process": true
    });

    let url = this.props.api_url + "/api/user?type=signup";

    axios.post(url, {
      "name": this.state.name,
      "email": this.state.email,
      "password": this.state.password
    }).then((response) => {
      this.setState({
        "name": "",
        "email": "",
        "password": "",
        "is_in_process": false
      });
      alert("가입이 완료되었습니다.");
    }).catch((error) => {
      alert(error.response.data.message);
      this.setState({
        "is_in_process": false
      });
    });
  };

  handleSignoutClick = (e) => {
    browserHistory.push("/main");
    this.props.signOut();
  };

  handleNameChange = (e) => {
    this.setState({
      "name": e.target.value
    });
  };

  handleEmailChange = (e) => {
    this.setState({
      "email": e.target.value
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      "password": e.target.value
    });
  };

  render() {
    return (
      <Container>
        <div>
          <Menu pointing secondary>
            <Menu.Item name="주문관리시스템" />

            <Link to="/main"><Menu.Item name='메인' className={this.activeRoute("/main")} /></Link>

            {this.props.jwt !== null &&
            <Dropdown item text="그룹" className={this.activeRoute("/group")}>
              <Dropdown.Menu>
                <Link to="/group/list"><Dropdown.Item>그룹 목록</Dropdown.Item></Link>
                <Link to="/group/create"><Dropdown.Item>그룹 생성</Dropdown.Item></Link>
              </Dropdown.Menu>
            </Dropdown>
            }

            {this.props.jwt !== null && this.props.group_id !== null &&
            <Dropdown item text='주문' className={this.activeRoute("/order")}>
              <Dropdown.Menu>
                <Link to="/order/request"><Dropdown.Item>주문 입력</Dropdown.Item></Link>
                <Link to="/order/list"><Dropdown.Item>주문 내역</Dropdown.Item></Link>
                {this.props.role > 0 &&
                <Link to="/order/verify"><Dropdown.Item>주문 처리</Dropdown.Item></Link>
                }
              </Dropdown.Menu>
            </Dropdown>
            }

            {this.props.jwt !== null && this.props.group_id !== null &&
            <Link to="/queue"><Menu.Item name="대기열" /></Link>
            }

            {this.props.jwt !== null && this.props.group_id !== null &&
            <Menu.Item name="통계" />
            }

            {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 &&
            <Dropdown item text='관리' className={this.activeRoute("/manage")}>
              <Dropdown.Menu>
                <Link to="/manage/menu"><Dropdown.Item>메뉴 관리</Dropdown.Item></Link>
                <Link to="/manage/setmenu"><Dropdown.Item>세트메뉴 관리</Dropdown.Item></Link>
                <Link to="/manage/member"><Dropdown.Item>멤버 관리</Dropdown.Item></Link>
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
                    <Button type='submit' loading={this.state.is_in_process}>로그인</Button>
                  </Form>
                </Modal.Content>
              </Modal>
              }

              {this.props.jwt === null &&
              <Modal trigger={<Menu.Item name='회원가입' />} size='small'>
                <Header icon='add user' content='회원가입' />
                <Modal.Content>
                  <Form onSubmit={this.handleSignupSubmit}>
                    <Form.Field>
                      <label>이름</label>
                      <Input type="text" value={this.state.name} onChange={this.handleNameChange} placeholder='이름 입력' />
                    </Form.Field>

                    <Form.Field>
                      <label>이메일</label>
                      <Input type="email" value={this.state.email} onChange={this.handleEmailChange} placeholder='이메일 입력' />
                    </Form.Field>

                    <Form.Field>
                      <label>비밀번호</label>
                      <Input type="password" value={this.state.password} onChange={this.handlePasswordChange} placeholder='비밀번호 입력' />
                    </Form.Field>
                    <Button type='submit' loading={this.state.is_in_process}>제출</Button>
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