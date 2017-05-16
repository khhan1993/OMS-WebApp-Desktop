import React from 'react';
import { Container, Segment, Grid, Message } from 'semantic-ui-react';

class Main extends React.Component {
  render() {
    return (
      <Segment textAlign="center" vertical className="masthead">
       <Container text>
        <Header as="h1" inverted>
          휴:옴스
        </Header>
        <Header as="h2" inverted>
          한양대 주문 관리 시스템
        </Header>
       </Container>
      </Segment>
      <Grid container columns="equal">
        <Grid.Row centered>
          <Grid.Column computer={10} tablet={12} mobile={15}>
            <Message>
              <Message.Header>
                2017 HYU OMS
              </Message.Header>
              <p>
                개선해야 될 점 등의 의견을 남겨주세요! 여러분의 의견은 더 나은 시스템을 만드는 데 도움이 됩니다.
              </p>
            </Message>
            <div id="disqus_thread" />
          </Grid.Column>
        </Grid.Row>
        {(function() {
          let d = document, s = d.createElement('script');
          s.src = 'https://2017-hyu-oms.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
        })()}
      </Grid>
    )
  }
}

export default Main;