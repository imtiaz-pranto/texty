import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { Notice, Icon, Spinner } from '@wordpress/components';

function Status() {
  const [isConnected, setIsConnected] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);

    apiFetch({
      path: '/texty/v1/status',
    }).then((resp) => {
      setIsFetching(false);
      setIsConnected(resp.success);
    });
  }, []);

  if (isFetching) {
    return (
      <Notice>
        <Spinner />
      </Notice>
    );
  }

  return (
    <div className={isConnected ?
      'bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3' :
      'bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-3'
    }>
      <div className={isConnected ?
        'flex items-center justify-center w-8 h-8 rounded-full bg-green-100' :
        'flex items-center justify-center w-8 h-8 rounded-full bg-red-100'
      }>
        {isConnected ? (
          <span className="text-green-600 text-xl">✓</span>
        ) : (
          <span className="text-red-600 text-xl">✕</span>
        )}
      </div>
      <div>
        <p className={isConnected ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
          {isConnected ? __('Gateway Connected', 'texty') : __('Gateway Not Connected', 'texty')}
        </p>
        <p className={isConnected ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
          {isConnected ?
            __('Your SMS gateway is configured and ready to send messages', 'texty') :
            __('Please configure your SMS gateway settings', 'texty')
          }
        </p>
      </div>
    </div>
  );
}

export default Status;
