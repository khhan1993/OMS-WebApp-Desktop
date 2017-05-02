import React from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Button, Table, Segment, Loader, Dimmer } from 'semantic-ui-react';
import axios from 'axios';

class Queue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      "queue": [],
      "is_loading": true
    };
  }

  componentDidMount() {
    this.getQueue();
  }

  getQueue() {
    let url = this.props.api_url + "/api/queue?jwt=" + this.props.jwt + "&group_id=" + (this.props.group_id).toString();

    axios.get(url)
      .then((response) => {
        this.setState({
          "queue": response.data,
          "is_loading": false
        });
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  getCount(queueItem) {
    let count_total = 0;
    for(let data of queueItem.queue) {
      count_total += parseInt(data['amount'], 10);
    }

    return count_total;
  };

  visualizeQueue(queueItem) {
    let temp_queue = queueItem.queue.slice(0);
    while(temp_queue.length > 5) {
      temp_queue.pop();
    }

    if(queueItem.queue.length > 5) {
      temp_queue.push({
        "no_more": true
      });
    }

    return temp_queue.map((item) => {
      if(item['no_more'] === true) {
        return (
          <Button key="0-0-0" size="small" icon="warning sign" content="더 있음" disabled />
        );
      }
      else {
        return (
          <Button
            key={(item.order_id).toString() + "-" + (item.menu_id).toString() + "-" + (item.set_reference_id).toString()}
            size="small"
            content={"Table " + (item.table_id).toString()}
            icon='send outline'
            label={{ as: 'a', basic: true, content: item.amount }}
            labelPosition='right'
            active={item.set_reference_id !== 0}
            onClick={(e) => this.handleOnClick(item)}
          />
        );
      }
    });
  }

  handleOnClick = (item) => {
    if(confirm("대기열에서 해당 항목을 제거하겠습니까?")) {
      let url = this.props.api_url + "/api/queue?jwt=" + this.props.jwt;

      axios.put(url, {
        "order_id": item.order_id,
        "menu_id": item.menu_id,
        "set_reference_id": item.set_reference_id
      }).then((response) => {
        this.setState({
          "is_loading": true
        });
        this.getQueue();
      }).catch((error) => {
        alert(error.response.data.message);
      });
    }
  };

  render() {
    let rowItems = this.state.queue.map((rowItem) =>
      <Table.Row key={rowItem.id}>
        <Table.Cell>{rowItem.name}</Table.Cell>
        <Table.Cell>{this.getCount(rowItem)}</Table.Cell>
        <Table.Cell>{this.visualizeQueue(rowItem)}</Table.Cell>
      </Table.Row>
    );

    return (
      <Grid columns="equal">
        <Grid.Row centered>
          <Grid.Column width={13}>
            <Segment>
              <Dimmer active={this.state.is_loading} inverted>
                <Loader active={this.state.is_loading} />
              </Dimmer>

              <Header as="h3" textAlign="center">메뉴별 대기열</Header>
              <Table celled size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>이름</Table.HeaderCell>
                    <Table.HeaderCell>대기 수량</Table.HeaderCell>
                    <Table.HeaderCell>대기열 (세트메뉴의 경우 진하게 표시)</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rowItems}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    "jwt": state.auth.jwt,
    "api_url": state.auth.api_url,
    "group_id": state.auth.group_id
  }
};

export default connect(
  mapStateToProps
)(Queue);
