import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Tag, Divider } from 'antd';
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
                <p>
                  <i className={styles.address} />
                  {currentUser.geographic.province.label}
                  {currentUser.geographic.city.label}
                </p>
              </div>
              <Divider dashed />
              <div className={styles.tags}>
                <div className={styles.tagsTitle}>标签</div>
                {currentUser.tags.map(item => (
                  <Tag key={item.key}>{item.label}</Tag>
                ))}
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
