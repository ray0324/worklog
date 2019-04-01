import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Button } from 'antd';
import { connect } from 'dva';
import styles from './SecurityView.less';

const FormItem = Form.Item;

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class SecurityView extends Component {
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      console.log(values);
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newpwd')) {
      callback(formatMessage({ id: 'app.settings.security.password-confirm-diffrent' }));
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.SecurityView}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: 'app.settings.security.password-old' })}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.security.password-old' }, {}),
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.security.password-new' })}>
              {getFieldDecorator('newpwd', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.security.password-new' }, {}),
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.security.password-confirm' })}>
              {getFieldDecorator('newpwdconfirm', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.security.password-confirm' }, {}),
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input type="password" />)}
            </FormItem>

            <Button type="primary" htmlType="submit">
              <FormattedMessage
                id="app.settings.security.password-update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default SecurityView;
