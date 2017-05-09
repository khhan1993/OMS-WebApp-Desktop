import React from 'react';
import { Grid } from 'semantic-ui-react';

class Main extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid.Row centered>
          <p>
            2017년도 주문관리시스템 Prototype 입니다.
          </p>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Main;