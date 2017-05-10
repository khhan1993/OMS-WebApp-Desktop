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
      "name": "",
      "email": "",
      "password": "",
      "is_in_process": false,
      "is_mobile_menu_expanded": false,
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

        axios.post(url, response.authResponse).then((response) => {
          this.props.signIn(response.data.jwt);
          this.setState({
            "name": "",
            "email": "",
            "password": "",
            "is_in_process": false
          });
          browserHistory.push("/group/list");
        }).catch((error) => {
          alert(error.response.data.message);
          this.setState({
            "is_in_process": false
          });
        });
      }
    });
  };

  render() {
    return (
      <div>
        <Grid container>
          <Grid.Row only="computer tablet">
            <Grid.Column>
              <Menu pointing secondary>
                <Menu.Item header name="2017 HYU OMS" />

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
                <Link to="/queue"><Menu.Item name="대기열" className={this.activeRoute("/queue")} /></Link>
                }

                {this.props.jwt !== null && this.props.group_id !== null &&
                <Menu.Item>통계 (준비중)</Menu.Item>
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
                  <Modal closeIcon trigger={<Menu.Item name='로그인' />} size='small'>
                    <Header icon='sign in' content='로그인' />
                    <Modal.Content>
                      <Button color="facebook" type='button' loading={this.state.is_in_process} icon onClick={(e) => this.handleFacebookLogin()}><Icon name="facebook square" /> Facebook</Button>
                    </Modal.Content>
                  </Modal>
                  }

                  {this.props.jwt !== null &&
                  <Menu.Item name='로그아웃' onClick={this.handleSignoutClick} />
                  }
                </Menu.Menu>
              </Menu>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row only="mobile">
            <Menu fluid stackable>
              <Menu.Item header onClick={(e) => this.toggleMobileMenu()}>2017 HYU OMS &nbsp; <Icon name={this.state.is_mobile_menu_expanded ? "chevron up" : "chevron down"} /></Menu.Item>

              {this.state.is_mobile_menu_expanded &&
              <Link to="/main"><Menu.Item name='메인' className={this.activeRoute("/main")} /></Link>
              }

              {this.props.jwt !== null && this.state.is_mobile_menu_expanded &&
              <Dropdown basic item text="그룹" className={this.activeRoute("/group")}>
                <Dropdown.Menu>
                  <Link to="/group/list"><Dropdown.Item>그룹 목록</Dropdown.Item></Link>
                  <Link to="/group/create"><Dropdown.Item>그룹 생성</Dropdown.Item></Link>
                </Dropdown.Menu>
              </Dropdown>
              }

              {this.props.jwt !== null && this.props.group_id !== null && this.state.is_mobile_menu_expanded &&
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

              {this.props.jwt !== null && this.props.group_id !== null && this.state.is_mobile_menu_expanded &&
              <Link to="/queue">
                <Menu.Item name="대기열" className={this.activeRoute("/queue")} /></Link>
              }

              {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 && this.state.is_mobile_menu_expanded &&
              <Dropdown item text='관리' className={this.activeRoute("/manage")}>
                <Dropdown.Menu>
                  <Link to="/manage/menu"><Dropdown.Item>메뉴 관리</Dropdown.Item></Link>
                  <Link to="/manage/setmenu"><Dropdown.Item>세트메뉴 관리</Dropdown.Item></Link>
                  <Link to="/manage/member"><Dropdown.Item>멤버 관리</Dropdown.Item></Link>
                </Dropdown.Menu>
              </Dropdown>
              }

              {this.props.jwt === null && this.state.is_mobile_menu_expanded &&
              <Modal closeIcon trigger={<Menu.Item name='로그인' />} size='fullscreen'>
                <Header icon='sign in' content='로그인' />
                <Modal.Content>
                  <Button color="facebook" type='button' fluid loading={this.state.is_in_process} icon onClick={(e) => this.handleFacebookLogin()}><Icon name="facebook square" /> Facebook</Button>
                </Modal.Content>
              </Modal>
              }

              {this.props.jwt !== null && this.state.is_mobile_menu_expanded &&
              <Menu.Item name='로그아웃' onClick={this.handleSignoutClick} />
              }
            </Menu>
          </Grid.Row>
        </Grid>

        <br/>

        {this.props.children}

        <br/>

        <Header as="h5" textAlign="center" color="grey">
          &copy; 2014 - 2017 한양대학교 한기훈<br/>
          <small>본 시스템은 한양대학교 Lion Lab 으로부터 서버를 지원받았습니다.</small>
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