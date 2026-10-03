import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function Loading() {
  return (
    <div className="Loading">
      <p>Loading</p>

      <Spin
        indicator={
          <LoadingOutlined spin style={{ fontSize: '50px', color: 'Black' }} />
        }
      />
    </div>
  );
}
