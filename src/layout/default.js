import React from 'react';
import { Menu, Dropdown, Header, Modal, Button, Grid, Icon} from 'semantic-ui-react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, browserHistory } from 'react-router';

import authAction from '../action/index';
const { signIn, signOut } = authAction.auth;


class Default extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "is_in_process": false,
      "is_mobile_menu_expanded": true,
      "check_jwt_valid_interval": null,
      "remain_jwt_valid_time": null
    };
  }

  componentWillMount() {
    this.setState({
      "check_jwt_valid_interval": setInterval(this.chk_jwt_valid, 1000)
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.check_jwt_valid_interval);
  }

  chk_jwt_valid = () => {
    if(this.props.jwt) {
      let jwt_content = this.props.jwt.split(".")[1];
      let decoded_content = JSON.parse(atob(jwt_content));
      let exp_unixtime = parseInt(decoded_content['exp'], 10);
      let cur_unixtime = Math.round((new Date()).getTime() / 1000);

      if(exp_unixtime - cur_unixtime < 0) {
        alert("로그인 유효 시간이 만료되었습니다.\n다시 로그인해주세요.");
        browserHistory.push("/main");
        this.props.signOut();
        this.setState({
          "remain_jwt_valid_time": null
        });
      }
    }
  };

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  handleSignoutClick = (e) => {
    browserHistory.push("/main");
    this.props.signOut();
  };

  toggleMobileMenu = () => {
    this.setState({
      "is_mobile_menu_expanded": !this.state.is_mobile_menu_expanded
    });
  };

  handleFacebookLogin = () => {
    window.FB.login((response) => {
      if(response.status === 'connected') {
        let url = this.props.api_url + "/api/user?type=facebook";

        this.setState({
          "is_in_process": true
        });

        axios.post(url, response.authResponse)
          .then((response) => {
          this.props.signIn(response.data.jwt);
          this.setState({
            "is_in_process": false
          });
          browserHistory.push("/group");
        }).catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_in_process": false
          });
        });
      }
    });
  };

  handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        let access_token = authObj['access_token'];
        let url = this.props.api_url + "/api/user?type=kakao";

        this.setState({
          "is_in_process": true
        });

        axios.post(url, {
          "accessToken": access_token
        }).then((response) => {
          this.props.signIn(response.data.jwt);
          this.setState({
            "is_in_process": false
          });
          browserHistory.push("/group");
          //window.Kakao.Auth.logout();
        }).catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_in_process": false
          });
        });
      },
      fail: (err) => {
        console.log(err);
      }
    });
  };

  render() {
    return (
      <div>
        <Grid container>
          <Grid.Row only="computer tablet">
            <Menu className="navbar page grid" borderless fixed="top">
              <Menu.Item header name="2017 HYU OMS" />

              <Link to="/main"><Menu.Item name='메인' className={this.activeRoute("/main")} /></Link>

              {this.props.jwt !== null &&
              <Link to="/group"><Menu.Item name='그룹' className={this.activeRoute("/group")} /></Link>
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
              <Link to="/queue"><Menu.Item name="대기열" className={this.activeRoute("/queue")} /></Link>
              }

              {this.props.jwt !== null && this.props.group_id !== null &&
              <Link to="/statistics"><Menu.Item>통계</Menu.Item></Link>
              }

              {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 &&
              <Dropdown item text='관리' className={this.activeRoute("/manage")}>
                <Dropdown.Menu>
                  <Link to="/manage/menu"><Dropdown.Item>메뉴 관리</Dropdown.Item></Link>
                  <Link to="/manage/setmenu"><Dropdown.Item>세트메뉴 관리</Dropdown.Item></Link>
                  <Link to="/manage/member_and_group"><Dropdown.Item>그룹/멤버 관리</Dropdown.Item></Link>
                </Dropdown.Menu>
              </Dropdown>
              }

              <Menu.Menu position='right'>
                {this.props.jwt === null &&
                <Modal closeIcon trigger={<Menu.Item name='로그인' />} size='small'>
                  <Header icon='sign in' content='로그인' />
                  <Modal.Content>
                    <Button color="facebook" type='button' loading={this.state.is_in_process} icon onClick={(e) => this.handleFacebookLogin()}><Icon name="facebook square" /> Facebook</Button>
                    <Button color='yellow' type="button" loading={this.state.is_in_process} icon onClick={(e) => this.handleKakaoLogin()}><Icon name="comment" /> Kakao</Button>
                  </Modal.Content>
                </Modal>
                }

                {this.props.jwt !== null &&
                <Menu.Item name='로그아웃' onClick={this.handleSignoutClick} />
                }
              </Menu.Menu>
            </Menu>
          </Grid.Row>
          <Grid.Row only="mobile">
            <Menu className="navbar active" borderless fluid stackable vertical>
              <Menu.Item header onClick={(e) => this.toggleMobileMenu()}>2017 HYU OMS &nbsp; <Icon name={this.state.is_mobile_menu_expanded ? "chevron up" : "chevron down"} /></Menu.Item>

              {this.state.is_mobile_menu_expanded &&
              <Link to="/main"><Menu.Item header name='메인' className={this.activeRoute("/main")} /></Link>
              }

              {this.props.jwt !== null && this.state.is_mobile_menu_expanded &&
              <Link to="/group"><Menu.Item header name='그룹' className={this.activeRoute("/group")} /></Link>
              }

              {this.props.jwt !== null && this.props.group_id !== null && this.state.is_mobile_menu_expanded &&
              <Menu.Item>
                <Menu.Header>주문</Menu.Header>

                <Menu.Menu>
                  <Link to="/order/request"><Menu.Item name='주문 입력' className={this.activeRoute("/order/request")} /></Link>
                  <Link to="/order/list"><Menu.Item name='주문 내역' className={this.activeRoute("/order/list")} /></Link>
                  {this.props.role > 0 &&
                  <Link to="/order/verify"><Menu.Item name='주문 처리' className={this.activeRoute("/order/verify")} /></Link>
                  }
                </Menu.Menu>
              </Menu.Item>
              }

              {this.props.jwt !== null && this.props.group_id !== null && this.state.is_mobile_menu_expanded &&
              <Link to="/queue">
                <Menu.Item header name="대기열" className={this.activeRoute("/queue")} /></Link>
              }

              {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 && this.state.is_mobile_menu_expanded &&
              <Menu.Item>
                <Menu.Header>관리</Menu.Header>

                <Menu.Menu>
                  <Link to="/manage/menu"><Menu.Item name='메뉴 관리' className={this.activeRoute("/manage/menu")} /></Link>
                  <Link to="/manage/setmenu"><Menu.Item name='세트메뉴 관리' className={this.activeRoute("/manage/setmenu")} /></Link>
                  <Link to="/manage/member_and_group"><Menu.Item name='그룹/멤버 관리' className={this.activeRoute("/manage/member_and_group")} /></Link>
                </Menu.Menu>
              </Menu.Item>
              }

              {this.props.jwt === null && this.state.is_mobile_menu_expanded &&
              <Modal closeIcon trigger={<Menu.Item header name='로그인' />} size='fullscreen'>
                <Header icon='sign in' content='로그인' />
                <Modal.Content>
                  <Button color="facebook" type='button' loading={this.state.is_in_process} icon onClick={(e) => this.handleFacebookLogin()}><Icon name="facebook square" /> Facebook</Button>
                  <Button color='yellow' type="button" loading={this.state.is_in_process} icon onClick={(e) => this.handleKakaoLogin()}><Icon name="comment" /> Kakao</Button>
                </Modal.Content>
              </Modal>
              }

              {this.props.jwt !== null && this.state.is_mobile_menu_expanded &&
              <Menu.Item header name='로그아웃' onClick={this.handleSignoutClick} />
              }
            </Menu>
          </Grid.Row>
        </Grid>

        <br/>

        {this.props.children}

        <br/>

        <Header as="h5" textAlign="center" color="grey">
          &copy; 2014 - 2017 한양대학교 한기훈<br/>
        </Header>

        <br/>
      </div>
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