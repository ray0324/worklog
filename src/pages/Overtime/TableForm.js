/* eslint-disable no-underscore-dangle */
import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, DatePicker, TimePicker, message, Popconfirm, Divider } from 'antd';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import styles from './Register.less';

const prefix = 'NEW_TEMP_ID_';

class TableForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      loading: false,
      originData: props.data,
      originSelectedMonth: props.selectedMonth, // 选择的月份
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    // 切换月份 更新数据
    if (nextProps.selectedMonth !== preState.originSelectedMonth) {
      return {
        data: nextProps.data,
        originData: nextProps.data,
        originSelectedMonth: nextProps.selectedMonth,
      };
    }

    if (isEqual(nextProps.data, preState.originData)) {
      return null;
    }

    const tmp = preState.data.filter(item => item.editable);

    // 筛选过滤
    return {
      data: [...nextProps.data, ...tmp],
      originData: nextProps.data,
    };
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item._id === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      _id: `${prefix}${this.index}`,
      date: moment()
        .subtract(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD'),
      time: '20:00',
      desc: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const target = data.filter(item => item._id === key)[0];
    if (target.isNew) {
      const newData = data.filter(item => item._id !== key);
      this.setState({
        data: newData,
      });
      return;
    }
    onChange({ type: 'remove', data: target });
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(value, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      console.log(target);
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};

      if (!target.date || !target.time || !target.desc) {
        message.error('请填写完整加班信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }

      const { onChange } = this.props;

      if (target.isNew) {
        onChange({
          type: 'create',
          data: target,
        });
      } else {
        onChange({
          type: 'update',
          data: target,
        });
      }

      delete target.editable;
      delete target.isNew;

      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: '_id',
        key: '_id',
        width: '5%',
        render: (text, record, idx) => <span>{idx + 1}</span>,
      },
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: '15%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <DatePicker
                placeholder="日期"
                defaultValue={moment(text, 'YYYY-MM-DD')}
                format="YYYY-MM-DD"
                onChange={(date, dateStr) => this.handleFieldChange(dateStr, 'date', record._id)}
              />
            );
          }
          return text;
        },
      },
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: '10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TimePicker
                defaultValue={moment(text, 'HH:mm')}
                format="HH:mm"
                onChange={(time, timeStr) => this.handleFieldChange(timeStr, 'time', record._id)}
              />
            );
          }
          return text;
        },
      },
      {
        title: '加班事项',
        dataIndex: 'desc',
        key: 'desc',
        width: '40%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e.target.value, 'desc', record._id)}
                onKeyPress={e => this.handleKeyPress(e, record._id)}
                placeholder="加班事项"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        width: '10%',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record._id)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record._id)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record._id)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record._id)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record._id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record._id)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    const { loading, data } = this.state;

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          rowKey={(record, index) => index}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增记录
        </Button>
      </Fragment>
    );
  }
}

export default TableForm;
