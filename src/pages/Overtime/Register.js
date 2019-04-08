/* eslint-disable react/jsx-closing-tag-location */
import React, { PureComponent } from 'react';
import { Card, DatePicker } from 'antd';
import { connect } from 'dva';
// import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';

const { MonthPicker } = DatePicker;

@connect(({ overtime: { records, selectedMonth } }) => ({
  records,
  selectedMonth,
}))
class OvertimeRegister extends PureComponent {
  constructor(props) {
    super(props);
    const { selectedMonth } = props;
    this.onMonthChange(selectedMonth);
  }

  onMonthChange = selectedMonth => {
    const { dispatch } = this.props;
    dispatch({
      type: 'overtime/queryRecords',
      payload: {
        selectedMonth,
      },
    });
  };

  onDataChange = ({ type, data }) => {
    const { dispatch } = this.props;
    const dict = {
      create: 'overtime/createRecord',
      update: 'overtime/updateRecord',
      remove: 'overtime/removeRecord',
    };
    dispatch({
      type: dict[type],
      payload: {
        record: data,
      },
    });
  };

  render() {
    const { records, selectedMonth } = this.props;

    const extra = (
      <MonthPicker
        onChange={this.onMonthChange}
        defaultValue={selectedMonth}
        format="YYYY年MM月"
        placeholder="Select month"
      />
    );

    return (
      <PageHeaderWrapper>
        <Card title="加班申报表" extra={extra}>
          <TableForm
            data={records}
            selectedMonth={selectedMonth.format('YYYY-MM')}
            onChange={this.onDataChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default OvertimeRegister;
