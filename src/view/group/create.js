import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Form, Input, Segment, Loader, Dimmer } from 'semantic-ui-react';
import axios from 'axios';

class GroupCreate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      "name": "",
      "is_on_creation": false
    };
  }

  handleChange = (e) => {
    this.setState({
      "name": e.target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      "is_on_creation": true
    });

    let url = this.props.api_url + "/api/group?jwt=" + this.props.jwt;
    axios.post(url, {
      "name": this.state.name
    }).then((response) => {
      let alert_msg = "그룹 생성이 완료되었습니다.\n";
      alert_msg += "Group Name : " + this.state.name + "\n";
      alert_msg += "Group ID : " + (response.data.group_id).toString();

      alert(alert_msg);

      this.setState({
        "name": "",
        "is_on_creation": false
      });
    }).catch((error) => {
      alert(error.response.data.message);

      this.setState({
        "is_on_creation": false
      });
    });
  };

  render() {
    return (
      <Grid columns="equal">
        <Grid.Row centered>
          <Grid.Column width={6}>
            <Segment>
              <Dimmer active={this.state.is_on_creation} inverted>
                <Loader active={this.state.is_on_creation}>생성 중...</Loader>
              </Dimmer>

              <Header as="h2" textAlign="center">새 그룹 생성</Header>
              <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <label>새 그룹 이름</label>
                  <Input type="text" value={this.state.name} onChange={this.handleChange} placeholder='새 그룹 이름 입력' required />
                </Form.Field>

                <Button fluid type='submit'>생성하기</Button>
              </Form>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url
  }
};

export default connect(
  mapStateToProps
)(GroupCreate);