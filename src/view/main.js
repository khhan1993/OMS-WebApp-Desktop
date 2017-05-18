import React from 'react';
// import { Container, Segment, Header, Message } from 'semantic-ui-react';
import { Button } from 'react-bootstrap';

class Main extends React.Component {
  render() {
    return (
      <div className="masthead segment">
        <div className="container">
          <h1 className="text-center">휴:옴스</h1>
          <h2 className="text-center">
            한양대 축제 주점 관리 시스템
            <br/><br/>
            <Button className="btn btn-outline-primary">FACEBOOK LOGIN</Button>
            <br/><br/>
            <Button className="btn btn-outline-primary kakao">KAKAO LOGIN</Button>
          </h2>
        </div>
      </div>
    )
  }
}

export default Main;