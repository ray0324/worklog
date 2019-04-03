import React, { PureComponent } from 'react';
import { Card, Button, Form, DatePicker, Divider } from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from './TableForm';
import styles from './Register.less';

const { MonthPicker } = DatePicker;

@connect(({ loading, overtime: { records, selectedMonth } }) => ({
  submitting: loading.effects['overtime/submitOvertimeRecords'],
  records,
  selectedMonth,
}))
@Form.create()
class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
  };

  constructor(props) {
    super(props);
    const { dispatch, selectedMonth } = props;
    dispatch({
      type: 'overtime/querySelectedRecords',
      payload: {
        selected: selectedMonth.format('YYYY-MM'),
      },
    });
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // submit the values
        dispatch({
          type: 'overtime/submitOvertimeRecords',
          payload: values,
        });
      }
    });
  };

  onMonthChange = (date, dateString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'overtime/querySelectedRecords',
      payload: {
        selected: dateString,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      console.log(values);
      dispatch({
        type: 'overtime/submitOvertimeRecords',
        payload: values,
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      records,
      selectedMonth,
    } = this.props;
    const { width } = this.state;
    console.log(selectedMonth);

    return (
      <PageHeaderWrapper
        title="加班申报表"
        content="互联网金融部&amp;信息技术部加班申报表"
        wrapperClassName={styles.advancedForm}
      >
        <Card>
          <MonthPicker
            onChange={this.onMonthChange}
            defaultValue={selectedMonth}
            format="YYYY-MM"
            placeholder="Select month"
          />
          <Divider style={{ marginBottom: 32 }} />
          {getFieldDecorator('records', {
            initialValue: records,
          })(<TableForm />)}
        </Card>
        <FooterToolbar style={{ width }}>
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default AdvancedForm;
