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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{__('Tools', 'texty')}</h1>
        <p className="text-gray-600">{__('Test and manage your SMS functionality', 'texty')}</p>
      </div>

      <Status />

      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex-[0_48%] max-sm:flex-[0_100%]">
          <Card className="mt-5 shadow-lg border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100 font-semibold">{__('Test Message', 'texty')}</CardHeader>
            <CardBody>
              <TestMessage />
            </CardBody>
          </Card>
        </div>
        <div className="flex-[0_48%] max-sm:flex-[0_100%]">
          <Card className="mt-5 shadow-lg border-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-100 font-semibold">{__('Quick Send', 'texty')}</CardHeader>
            <CardBody>
              <QuickSend />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Tools;
