/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
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
package org.kie.kogito.jobs.service.json;

import javax.enterprise.inject.Produces;
import javax.inject.Singleton;

import org.kie.kogito.jobs.service.api.serlialization.SerializationUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.cloudevents.jackson.JsonFormat;
import io.quarkus.jackson.ObjectMapperCustomizer;

public class JacksonConfiguration {

    private static final Logger LOGGER = LoggerFactory.getLogger(JacksonConfiguration.class);

    @Singleton
    @Produces
    public ObjectMapperCustomizer customizer() {
        return objectMapper -> {
            LOGGER.debug("Jackson customization initialized.");
            objectMapper
                    .registerModule(new JavaTimeModule())
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                    .disable(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE)
                    .registerModule(JsonFormat.getCloudEventJacksonModule());
            SerializationUtils.registerDescriptors(objectMapper);
        };
    }
}
