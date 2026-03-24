import React from 'react';
import { Composition } from 'remotion';
import { WebsiteStats } from './WebsiteStats';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WebsiteStats"
        component={WebsiteStats}
        durationInFrames={670}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};
