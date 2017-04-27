import React from 'react';
import { Menu, Container, Dropdown, Header, Modal, Button, Input, Form } from 'semantic-ui-react';

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
              <Modal trigger={<Menu.Item name='로그인' />} size='small'>
                <Header icon='sign in' content='로그인' />
                <Modal.Content>
                  <Form>
                    <Form.Field>
                      <label>이메일</label>
                      <Input type="email" placeholder='이메일 입력' />
                    </Form.Field>

                    <Form.Field>
                      <label>비밀번호</label>
                      <Input type="password" placeholder='비밀번호 입력' />
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                  </Form>
                </Modal.Content>
              </Modal>
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
                    <Button type='submit'>Submit</Button>
                  </Form>
                </Modal.Content>
              </Modal>
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