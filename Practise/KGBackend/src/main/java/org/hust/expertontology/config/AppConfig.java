package org.hust.expertontology.config;

import org.codehaus.jackson.map.ObjectMapper;
import org.hust.expertontology.Storage.StorageProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public StorageProperties storageProperties() {
        return new StorageProperties();
    }

}
