package com.example.jewellery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class CORSConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }

            @Override
            public void addResourceHandlers(ResourceHandlerRegistry registry) {
                // Serve barcode images from the filesystem so newly generated images are immediately available.
                // Prefer files in src/main/resources/barcodes/ during development, but fall back to classpath.
                try {
                    String projectDir = new File(".").getCanonicalPath();
                    String fsPath = "file:" + projectDir + File.separator + "src" + File.separator + "main" + File.separator + "resources" + File.separator + "barcodes" + File.separator;
                    registry.addResourceHandler("/barcodes/**")
                            .addResourceLocations(fsPath, "classpath:/barcodes/");
                } catch (Exception ex) {
                    // fallback to classpath only
                    registry.addResourceHandler("/barcodes/**")
                            .addResourceLocations("classpath:/barcodes/");
                }
            }
        };
    }
}
