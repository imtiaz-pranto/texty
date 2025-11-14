import React from 'react';
import { __ } from '@wordpress/i18n';
import { Card, CardBody, CardHeader } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Status from '../components/Status';
import QuickSend from '../components/QuickSend';
import TestMessage from '../components/TestMessage';

function Tools() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">{__('Tools', 'texty')}</h1>
        <p className="text-gray-600 leading-relaxed">{__('Test and manage your SMS functionality', 'texty')}</p>
      </div>

      <Status />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
          <CardHeader className="text-xl font-semibold flex items-center gap-2">
            <span>📨</span>
            <span>{__('Test Message', 'texty')}</span>
          </CardHeader>
          <CardBody className="p-8">
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {__('Send a test SMS to verify your gateway configuration is working correctly', 'texty')}
            </p>
            <TestMessage />
          </CardBody>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md">
          <CardHeader className="text-xl font-semibold flex items-center gap-2">
            <span>⚡</span>
            <span>{__('Quick Send', 'texty')}</span>
          </CardHeader>
          <CardBody className="p-8">
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {__('Send an SMS message to any number instantly', 'texty')}
            </p>
            <QuickSend />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Tools;
