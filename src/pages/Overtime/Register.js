import React, { PureComponent } from 'react';
import { Card, Row, Col, DatePicker, Divider } from 'antd';
import { connect } from 'dva';
// import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';
import styles from './Register.less';

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
      type: 'overtime/querySelectedRecords',
      payload: {
        selectedMonth,
      },
    });
  };

  onDataChange = data => {
    console.log(data);
  };

  render() {
    const { records, selectedMonth } = this.props;
    return (
      <PageHeaderWrapper
        title="加班申报表"
        content="互联网金融部&amp;信息技术部加班申报表"
        wrapperClassName={styles.advancedForm}
      >
        <Card>
          <Row>
            <Col xs={24} sm={12}>
              <div className={styles.userNameField}>
                <span>姓名:</span> 李小斌
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div className={styles.datePickField}>
                <span>月份:</span>
                <MonthPicker
                  onChange={this.onMonthChange}
                  defaultValue={selectedMonth}
                  format="YYYY-MM"
                  placeholder="Select month"
                />
              </div>
            </Col>
          </Row>
          <Divider style={{ marginBottom: 32 }} />
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
