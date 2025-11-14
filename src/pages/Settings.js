/**
 * External dependencies
 */
import React, { Fragment, useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import {
  Button,
  Spinner,
  BaseControl,
  TextControl,
  Card,
  CardBody,
  CardHeader,
} from '@wordpress/components';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';

/**
 * Internal dependencies
 */
import ActiveIcon from '../components/ActiveIcon';

function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    setIsLoading(true);

    apiFetch({
      path: '/texty/v1/settings?context=edit',
    }).then((resp) => {
      setSettings(resp);
      setIsLoading(false);
    });
  }, []);

  const setOption = (option, value) => {
    setSettings({
      ...settings,
      [option]: value,
    });
  };

  const setCredential = (provider, name, value) => {
    setSettings({
      ...settings,
      [provider]: {
        ...settings[provider],
        [name]: {
          ...settings[provider][name],
          ['value']: value,
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let data = {
      gateway: settings.gateway,
    };

    Object.keys(settings.gateways).forEach((gateway) => {
      Object.keys(settings[gateway]).forEach((field) => {
        if (!data.hasOwnProperty(gateway)) {
          data[gateway] = {};
        }

        data[gateway][field] = settings[gateway][field]['value'];
      });
    });

    setIsSaving(true);

    apiFetch({
      path: '/texty/v1/settings',
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

  const gateways = Object.keys(settings.gateways);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{__('Settings', 'texty')}</h1>
        <p className="text-gray-600 leading-relaxed">{__('Configure your SMS gateway settings', 'texty')}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
          <CardHeader className="text-xl font-semibold">{__('SMS Gateway', 'texty')}</CardHeader>
          <CardBody className="p-8">
            <fieldset disabled={isSaving}>
              <div className="pb-8">
                <div className="mb-6">
                  <label className="text-lg font-semibold text-gray-900">{__('Select Gateway', 'texty')}</label>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{__('Choose your preferred SMS service provider', 'texty')}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {gateways.map((key) => {
                    const { name, logo } = settings.gateways[key];

                    return (
                      <div
                        className={classNames(
                          'flex flex-col bg-white p-6 rounded-xl text-center cursor-pointer relative border-2 border-transparent',
                          'transition-all duration-200 hover:shadow-md hover:scale-105',
                          'max-sm:flex-row max-sm:text-left max-sm:items-center',
                          {
                            'border-blue-500 shadow-sm ring-4 ring-blue-100 scale-105': key === settings.gateway,
                            'opacity-40 hover:opacity-100 border-gray-200': key !== settings.gateway,
                          }
                        )}
                        key={'gateway-' + key}
                        onClick={() => setOption('gateway', key)}
                      >
                        <div className="h-12 flex items-center justify-center mb-3 max-sm:h-auto max-sm:mb-0 max-sm:flex-[0_40%]">
                          <img src={logo} alt={name} className="max-w-full max-h-10 object-contain" />
                        </div>

                        <div className="text-sm font-medium text-gray-900 max-sm:flex-1">{name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {gateways.map((key) => {
                const { name, description } = settings.gateways[key];

                return (
                  settings.gateway === key && (
                    <div
                      className={'pb-6 settings-' + key + ' bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg'}
                      key={'settings-' + key}
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{name} {__('Configuration', 'texty')}</h3>

                      <p className="mb-6 leading-relaxed">
                        {
                          <span
                            className="help text-gray-600 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: description,
                            }}
                          ></span>
                        }
                      </p>

                      {Object.keys(settings[key]).map((item) => {
                        const { name, type, value, help } = settings[key][item];

                        return (
                          <Fragment key={'field' + item}>
                            {
                              // for "from" fields, use phone input field
                            }
                            {item === 'from' && (
                              <BaseControl label={name} help={help}>
                                <PhoneInput
                                  country="us"
                                  value={value}
                                  onChange={(value) =>
                                    setCredential(key, item, value)
                                  }
                                />
                              </BaseControl>
                            )}

                            {item !== 'from' && (
                              <TextControl
                                label={name}
                                value={value}
                                type={type}
                                help={help}
                                onChange={(value) =>
                                  setCredential(key, item, value)
                                }
                              />
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  )
                );
              })}

              {/* {settings.gateway === 'twilio' && (
                <Twilio settings={settings.twilio} setOption={setCredential} />
              )}

              {settings.gateway === 'vonage' && (
                <Vonage settings={settings.vonage} setOption={setCredential} />
              )} */}
            </fieldset>
          </CardBody>
        </Card>

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

export default Settings;
