/*
 * Copyright 2021 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.kie.kogito.index.resources;

import org.kie.kogito.test.resources.TestResource;
import org.kie.kogito.test.utils.SocketUtils;
import org.testcontainers.Testcontainers;

public class KogitoServiceRandomPortTestResource implements TestResource {

    public static final String NAME = "kogito-service";

    public static final String KOGITO_SERVICE_URL = "kogito.service.url";

    private int httpPort;

    @Override
    public String getResourceName() {
        return NAME;
    }

    @Override
    public void start() {
        httpPort = SocketUtils.findAvailablePort();
        Testcontainers.exposeHostPorts(httpPort);
        //the hostname for the container to access the host is "host.testcontainers.internal"
        //https://www.testcontainers.org/features/networking/#exposing-host-ports-to-the-container
        System.setProperty(KOGITO_SERVICE_URL, "http://host.testcontainers.internal:" + httpPort);
    }

    @Override
    public void stop() {

    }

    @Override
    public int getMappedPort() {
        return httpPort;
    }
}
