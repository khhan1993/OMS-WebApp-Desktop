import React from 'react';
// import { Container, Menu, Dropdown, Header, Modal, Button, Grid, Icon, Segment} from 'semantic-ui-react';
import { Glyphicon, Button, Navbar, Nav, NavItem } from 'react-bootstrap';
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

  getCurrentRoute() {
    return this.props.location.pathname.split("/");
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


        axios.post(url, response.authResponse)
          .then((response) => {
          this.props.signIn(response.data.jwt);
          browserHistory.push("/group");
        }).catch((error) => {
          alert(error.response.data.message);
        });
      }
    });
  };

  handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: (authObj) => {
        let access_token = authObj['access_token'];
        let url = this.props.api_url + "/api/user?type=kakao";


        axios.post(url, {
          "accessToken": access_token
        }).then((response) => {
          this.props.signIn(response.data.jwt);
          browserHistory.push("/group");
          //window.Kakao.Auth.logout();
        }).catch((error) => {
          alert(error.response.data.message);
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
      <div className={this.props.jwt === null ? "background" : "background_menu"}>
        <div className="cover">
	<div className="container">
          <Navbar>
	    <div className="container">
              <Navbar.Header>
                <h2>HYUOMS</h2>
              </Navbar.Header>
              <Navbar>
                <Nav pullRight>
                  {this.props.jwt !== null &&
                  // <Dropdown item text="그룹" className={this.activeRoute("/group")}>
                    <NavItem eventKey={1} href="/group">GROUP</NavItem>
                    
                      // <Link to="/group/list"><Dropdown.Item>그룹 목록</Dropdown.Item></Link>
                      // <Link to="/group/create"><Dropdown.Item>그룹 생성</Dropdown.Item></Link>
                    // </Dropdown.Menu>
                  // </Dropdown>
                  }

                  {this.props.jwt !== null && this.props.group_id !== null &&
                  // <Dropdown item text='주문' className={this.activeRoute("/order")}>
                    <NavItem eventKey={2} href="/order/request">ORDER</NavItem>
                    // <Dropdown.Menu>
                      // <Link to="/order/request"><Dropdown.Item>주문 입력</Dropdown.Item></Link>
                      // <Link to="/order/list"><Dropdown.Item>주문 내역</Dropdown.Item></Link>
                      // {this.props.role > 0 &&
                      // <Link to="/order/verify"><Dropdown.Item>주문 처리</Dropdown.Item></Link>
                      // }
                    // </Dropdown.Menu>
                  // </Dropdown>
                  }

                  {this.props.jwt !== null && this.props.group_id !== null &&
                  <NavItem eventKey={3} href="/queue">QUEUE</NavItem>
                  // <Link to="/queue"><Menu.Item name="대기열" className={this.activeRoute("/queue")} /></Link>
                  }

                  {this.props.jwt !== null && this.props.group_id !== null &&
                  <NavItem eventKey={4} href="/statistics">DASHBOARD</NavItem>
                  // <Menu.Item>통계 (준비중)</Menu.Item>
                  }

                  {this.props.jwt !== null && this.props.group_id !== null && this.props.role > 1 &&
                  <NavItem eventKey={5} href="/manage/menu">SETTING</NavItem>
                  // <Dropdown item text='관리' className={this.activeRoute("/manage")}>
                    // <Dropdown.Menu>
                      // <Link to="/manage/menu"><Dropdown.Item>메뉴 관리</Dropdown.Item></Link>
                      // <Link to="/manage/setmenu"><Dropdown.Item>세트메뉴 관리</Dropdown.Item></Link>
                      // <Link to="/manage/member"><Dropdown.Item>멤버 관리</Dropdown.Item></Link>
                    // </Dropdown.Menu>
                  // </Dropdown>
                  }

                  {this.props.jwt !== null &&
                    <NavItem eventKey={6} href="#" onClick={this.handleSignoutClick}>LOGOUT</NavItem>
                  // <Menu.Item name='로그아웃' onClick={this.handleSignoutClick} />
                  }
                </Nav>
              </Navbar>
            </div>
          </Navbar>
          {this.props.jwt === null &&
          <div className="masthead segment">
            <div className="container">
              <h1 className="text-center">휴:옴스</h1>
              <h2 className="text-center">
                한양대 축제 주점 관리 시스템
                <br/><br/>
                <Button className="btn btn-outline-primary fb" onClick={(e) => this.handleFacebookLogin()}>FACEBOOK LOGIN</Button>
                <br/><br/>
                <Button className="btn btn-outline-primary kakao" onClick={(e) => this.handleKakaoLogin()}>KAKAO LOGIN</Button>
              </h2>
            </div>
          </div>
	  }
	  {this.props.jwt === null &&
          <div className="footer">
            <div className="container">
              <br/>
              <p className="text-center"><Glyphicon glyph="copyright-mark" ></Glyphicon> 2014-2017. 한양대학교 <b>한기훈</b> All Rights Reserved.</p>
              <br/>
            </div>
          </div>
          }
          {this.getCurrentRoute()[1]==='group' &&
          <h2>그룹<br/><br/></h2>
          }
          {this.getCurrentRoute()[1]==='queue' &&
          <h2>대기열<br/><br/></h2>
          }
          {this.getCurrentRoute()[1]==='statistics' &&
          <h2>통계<br/><br/></h2>
          }
          {this.getCurrentRoute()[1]==='order' &&
	  <div>
          <h2>주문</h2>
          <Nav activeKey={this.getCurrentRoute()[2]} className="nav-tabs">
            <NavItem eventKey={"request"} href="/order/request">입력</NavItem>
            <NavItem eventKey={"list"} href="/order/list">내역</NavItem>
            <NavItem eventKey={"verify"} href="/order/verify">처리</NavItem>
          </Nav>
	  </div>
          }
          {this.getCurrentRoute()[1]==='manage' &&
	  <div>
          <h2>설정</h2>
          <Nav activeKey={this.getCurrentRoute()[2]} className="nav-tabs">
            <NavItem eventKey={"menu"} href="/manage/menu">메뉴</NavItem>
            <NavItem eventKey={"setmenu"} href="/manage/setmenu">세트메뉴</NavItem>
            <NavItem eventKey={"member_and_group"} href="/manage/member_and_group">그룹</NavItem>
          </Nav>
	  </div>
          }
  	  <Button href="/guide" bsStyle="link" bsSize="large" style={{float:'right'}}><Glyphicon glyph="question-sign"/></Button>
	  </div>
	</div>
      </div>
      <br/><br/>
      {this.props.children}
      {this.props.jwt !== null &&
      <div className="footer">
	<div className="container">
  	  <br/><br/>
  	  <p className="text-center" style={{color:'black'}}><Glyphicon glyph="copyright-mark" ></Glyphicon> 2014-2017. 한양대학교 <b>한기훈</b> All Rights Reserved.</p>
          <br/>
        </div>
      </div>
      }
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
