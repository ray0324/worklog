import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';

@connect(({ loading, user, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
class Center extends PureComponent {
  render() {
    const { currentUser, currentUserLoading } = this.props;
    return (
      <GridContent className={styles.userCenter}>
        <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
          {currentUser && Object.keys(currentUser).length ? (
            <div>
              <div className={styles.avatarHolder}>
                <img alt="" src={currentUser.avatar} />
                <div className={styles.name}>{currentUser.name}</div>
                <div>{currentUser.signature}</div>
              </div>
              <div className={styles.detail}>
                <p>
                  <i className={styles.title} />
                  {currentUser.title}
                </p>
                <p>
                  <i className={styles.group} />
                  {currentUser.group}
                </p>
              </div>
            </div>
          ) : (
            'loading...'
          )}
        </Card>
      </GridContent>
    );
  }
}

export default Center;
