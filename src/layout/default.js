import React from 'react';
import { Menu, Container, Dropdown, Header } from 'semantic-ui-react';

class Default extends React.Component {

  render() {
    return (
      <Container>
        <div>
          <Menu pointing secondary>
            <Menu.Item name="한양대학교 주문관리시스템" />
            <Menu.Item name='메인' />
            <Dropdown item text='주문'>
              <Dropdown.Menu>
                <Dropdown.Item>주문 입력</Dropdown.Item>
                <Dropdown.Item>주문 내역</Dropdown.Item>
                <Dropdown.Item>주문 처리</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item name="대기열" />
            <Menu.Item name="통계" />
            <Dropdown item text='관리'>
              <Dropdown.Menu>
                <Dropdown.Item>메뉴 관리</Dropdown.Item>
                <Dropdown.Item>세트메뉴 관리</Dropdown.Item>
                <Dropdown.Item>멤버 관리</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Menu position='right'>
              <Menu.Item name='로그인' />
              <Menu.Item name='회원가입' />
              <Menu.Item name='로그아웃' />
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

export default Default;