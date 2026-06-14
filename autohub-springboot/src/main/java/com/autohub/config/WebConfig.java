package com.autohub.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuração global do Spring MVC.
 * Habilita CORS para que o frontend (rodando em qualquer porta)
 * possa consumir a API sem bloqueios de mesma origem.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Location", "X-Error-Code")   // expõe cabeçalhos customizados ao browser
                .maxAge(3600);
    }
}
