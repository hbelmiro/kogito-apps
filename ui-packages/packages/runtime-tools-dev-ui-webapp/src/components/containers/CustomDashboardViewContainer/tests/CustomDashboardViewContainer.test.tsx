/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import { mount } from 'enzyme';
import CustomDashboardViewContainer from '../CustomDashboardViewContainer';
import { CustomDashboardViewGatewayApiImpl } from '../../../../channel/CustomDashboardView/CustomDashboardViewGatewayApi';
import * as CustomDashboardViewContext from '../../../../channel/CustomDashboardView/CustomDashboardViewContext';
import DevUIAppContextProvider from '../../../contexts/DevUIAppContextProvider';
import { DefaultUser, User } from '@kogito-apps/consoles-common';
import { EmbeddedCustomDashboardView } from '@kogito-apps/custom-dashboard-view';

jest
  .spyOn(CustomDashboardViewContext, 'useCustomDashboardViewGatewayApi')
  .mockImplementation(() => new CustomDashboardViewGatewayApiImpl());

const user: User = new DefaultUser('jon', []);
const appContextProps = {
  devUIUrl: 'http://localhost:9000',
  openApiPath: '/mocked',
  isProcessEnabled: false,
  isTracingEnabled: false,
  omittedProcessTimelineEvents: [],
  isStunnerEnabled: false,
  availablePages: [],
  customLabels: {
    singularProcessLabel: 'test-singular',
    pluralProcessLabel: 'test-plural'
  },
  diagramPreviewSize: { width: 100, height: 100 }
};

describe('CustomDashboardViewContainer tests', () => {
  it('Snapshot', () => {
    const wrapper = mount(
      <DevUIAppContextProvider users={[user]} {...appContextProps}>
        <CustomDashboardViewContainer dashboardName="test-dashboard-name" />
      </DevUIAppContextProvider>
    );

    expect(wrapper.find('CustomDashboardViewContainer')).toMatchSnapshot();

    const forwardRef = wrapper.find(EmbeddedCustomDashboardView);

    expect(forwardRef.props().driver).not.toBeNull();

    expect(forwardRef.props().targetOrigin).toBe('http://localhost:9000');
  });
});
