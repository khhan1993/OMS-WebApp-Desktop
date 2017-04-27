import React from 'react';
import { Table, Grid, Header, Icon } from 'semantic-ui-react';

class OrderRequest extends React.Component {
  render() {
    return (
      <Grid columns="equal">
        <Grid.Row centered>
          <Grid.Column width={10}>
            <Header as="h2" textAlign="center">메뉴 목록</Header>
            <Table celled textAlign="center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>이름</Table.HeaderCell>
                  <Table.HeaderCell>가격</Table.HeaderCell>
                  <Table.HeaderCell>수량</Table.HeaderCell>
                  <Table.HeaderCell colSpan="3">Control Buttons</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Apples</Table.Cell>
                  <Table.Cell>1000</Table.Cell>
                  <Table.Cell>0</Table.Cell>
                  <Table.Cell><Icon name='plus' size='big' /></Table.Cell>
                  <Table.Cell><Icon name='minus' size='big' /></Table.Cell>
                  <Table.Cell><Icon name='remove' size='big' /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered>
          <Grid.Column width={10}>
            <Header as="h2" textAlign="center">세트메뉴 목록</Header>
            <Table celled textAlign="center">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>이름</Table.HeaderCell>
                  <Table.HeaderCell>가격</Table.HeaderCell>
                  <Table.HeaderCell>수량</Table.HeaderCell>
                  <Table.HeaderCell colSpan="3">Control Buttons</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Apples</Table.Cell>
                  <Table.Cell>1000</Table.Cell>
                  <Table.Cell>0</Table.Cell>
                  <Table.Cell><Icon name='plus' size='big' /></Table.Cell>
                  <Table.Cell><Icon name='minus' size='big' /></Table.Cell>
                  <Table.Cell><Icon name='remove' size='big' /></Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default OrderRequest;