import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { toast } from 'react-toastify';
import apiFetch from '@wordpress/api-fetch';
import classNames from 'classnames';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Panel,
  Spinner,
} from '@wordpress/components';
import NotificationItem from '../components/NotificationItem';

function Notifications() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setIsLoading(true);

    apiFetch({
      path: '/texty/v1/notifications?context=edit',
    }).then((resp) => {
      setSettings(resp);
      setIsLoading(false);
    });
  }, []);

  const setOption = (name, option, value) => {
    setSettings({
      ...settings,
      ['notifications']: {
        ...settings['notifications'],
        [name]: {
          ...settings['notifications'][name],
          [option]: value,
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = {};

    Object.keys(settings.notifications).forEach((item) => {
      if (!data.hasOwnProperty(item)) {
        data[item] = {};
      }

      let notif = settings.notifications[item];

      data[item] = {
        enabled: notif['enabled'],
        message: notif['message'],
        recipients: notif['recipients'],
        route: notif['route'],
      };
    });

    setIsSaving(true);

    apiFetch({
      path: '/texty/v1/notifications',
      method: 'POST',
      data: data,
    })
      .then((resp) => {
        setIsSaving(false);

        toast.success(__('Changes have been saved', 'texty'));
      })
      .catch((err) => {
        setIsSaving(false);
        console.log(err);
        toast.error(err.message);
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{__('Notifications', 'texty')}</h1>
        <p className="text-gray-600 leading-relaxed">
          {__(
            'Enable or disable notification based on different events.',
            'texty'
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.keys(settings.groups).map((group) => {
          const { title, available } = settings.groups[group];

          // Define border colors for different groups
          const borderColorClass = group === 'wordpress' ? 'border-blue-500' :
                                  group === 'woocommerce' ? 'border-purple-500' :
                                  'border-green-500';

          return (
            <Card key={group} className={classNames('bg-white rounded-xl shadow-sm border-l-4 transition-all duration-200', borderColorClass, {
              'opacity-60': !available,
            })}>
              <CardHeader
                className={classNames('text-lg font-semibold flex items-center gap-2')}
              >
                {group === 'wordpress' && <span>📝</span>}
                {group === 'woocommerce' && <span>🛒</span>}
                {group === 'dokan' && <span>🏪</span>}
                <span>{title}</span>

                {!available && (
                  <span className="ml-auto bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                    {__('Plugin not installed', 'texty')}
                  </span>
                )}
              </CardHeader>

              {available && (
                <CardBody className="has-panel">
                  <Panel>
                    {Object.keys(settings.notifications).map((notify) => {
                      const notification = settings.notifications[notify];

                      return (
                        group === notification.group && (
                          <NotificationItem
                            key={notify}
                            title={notification.title}
                            roles={settings.roles}
                            keyName={notification.id}
                            settings={notification}
                            setOption={setOption}
                          />
                        )
                      );
                    })}
                  </Panel>
                </CardBody>
              )}
            </Card>
          );
        })}

        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            isPrimary={true}
            isBusy={isSaving}
            disabled={isSaving}
            className="large px-8 py-3 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            {isSaving ? __('Saving...', 'texty') : __('Save Changes', 'texty')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Notifications;
